# Exploratory Data within the National Bridge Inventory (NBI)

## Insights

### Average latitude and longitude

We can see the average latitude and longitude for each structure, discarding the
structures with missing data. This provides a baseline for further statistical
analysis.

```sql
SELECT  AVG(latitude) latAvg,
        AVG(longitude) lonAvg
FROM    Structure
WHERE   latitude <> 0
AND     longitude <> 0
```

|            latAvg |             lonAvg |
|------------------:|-------------------:|
| 33.01063519595908 | -83.69312487837693 |

### Squared difference of each structure from average

Using the above query, we can enhance it to calculate the squared difference
from average. This allows us to get the variance and standard deviation later.

```sql
SELECT  (latitude - latAvg) latDiffSq,
        (longitude - lonAvg) lonDiffSq
FROM    Structure,
        (
  SELECT  AVG(latitude) latAvg,
          AVG(longitude) lonAvg
  FROM    Structure
  WHERE   latitude <> 0
  AND     longitude <> 0
        ) avgs
WHERE   latitude <> 0
AND     longitude <> 0
```

|           latDiffSq |           lonDiffSq |
|--------------------:|--------------------:|
| -1.2589651959590817 | -1.0785451216230655 |
| -2.2773051959590838 | -0.5435351216230657 |
| -2.2473051959590826 | -0.5368751216230692 |
|                     |      ...14,944 more |

### Variance of latitude and longitude

Again enhancing the above query, if we calculate the average differences, we
get the variances.

```sql
SELECT  AVG(latDiffSq) latVar,
        AVG(lonDiffSq) lonVar
FROM    (
  SELECT  (latitude - latAvg) latDiffSq,
          (longitude - lonAvg) lonDiffSq
  FROM    Structure,
          (
    SELECT  AVG(latitude) latAvg,
            AVG(longitude) lonAvg
    FROM    Structure
    WHERE   latitude <> 0
    AND     longitude <> 0
          ) avgs
  WHERE   latitude <> 0
  AND     longitude <> 0
        )
```

|              latVar |             lonVar |
|--------------------:|-------------------:|
| -0.0000000000000272 | 0.0000000000000031 |

### Standard deviation of latitude and longitude

Finally, we can again build upon the previous queries to get the standard
deviation by finding the square roots of the variances.

```sql
SELECT  SQRT(ABS(latVar)) latStdDev,
        SQRT(ABS(lonVar)) lonStdDev
FROM    (
  SELECT  AVG(latDiffSq) latVar,
          AVG(lonDiffSq) lonVar
  FROM    (
    SELECT  (latitude - latAvg) latDiffSq,
            (longitude - lonAvg) lonDiffSq
    FROM    Structure,
            (
      SELECT  AVG(latitude) latAvg,
              AVG(longitude) lonAvg
      FROM    Structure
      WHERE   latitude <> 0
      AND     longitude <> 0
            ) avgs
    WHERE   latitude <> 0
    AND     longitude <> 0
          )
        )
```

|          latStdDev |          lonStdDev |
|-------------------:|-------------------:|
| 0.0000001648377192 | 0.0000000554759096 |

### Number of inspections per structure

See how many times each structure has been inspected. Remember the dataset only
covers years 1990-2022.

```sql
SELECT        i.structureNumber,
              COUNT(*) inspectionTally
FROM          Inspection i
GROUP BY      i.structureNumber
```

| structureNumber | inspectionTally |
|:--------------- |----------------:|
| 1GA3906         |              19 |
| 1GA3988         |              15 |
| 1GA4976         |              19 |
|                 |  ...15,031 more |

### Years of inspection

The dataset contains inspection data from 1990-2022 (32 years). We can see how
many years of inspection data we have for each structure. In most cases, it will
be 32 years, but some structures are newer than 1990, so we use the year of the
data (2022) minus the year the structure was built.

```sql
SELECT        i.structureNumber,
              COUNT(*) inspectionTally,
              s.built,
              MIN(2022 - s.built, 32) yearsInpection
FROM          Inspection i
JOIN          Structure s
ON            s.number = i.structureNumber
GROUP BY      i.structureNumber,
              s.built
```

| structureNumber | inspectionTally | built | yearsInpection |
|:----------------|----------------:|------:|---------------:|
| 1GA3906         |              19 |  1981 |             32 |
| 1GA3988         |              15 |  1981 |             32 |
| 1GA4976         |              19 |  1981 |             32 |
|                 |                 |       | ...15,031 more |

### Inspections per year

With the above query, we have all the components to calculate the number of
inspections performed per year per structure.

```sql
SELECT        i.structureNumber,
              CAST(COUNT(*) AS float)
                / MIN(2022 - s.built, 32) inspectionsPerYear
FROM          Inspection i
JOIN          Structure s
ON            s.number = i.structureNumber
GROUP BY      i.structureNumber
```

| structureNumber | inspectionsPerYear |
|:----------------|-------------------:|
| 1GA3906         |            0.59375 |
| 1GA3988         |            0.46875 |
| 1GA4976         |            0.59375 |
|                 |     ...15,031 more |

### Average inspections per year

We can calculate the average number of inspections per year across all
structures by using the above query as a subquery.

```sql
SELECT        AVG(inspectionsPerYear) ipyAvg
FROM          (
  SELECT        i.structureNumber,
                CAST(COUNT(*) AS float)
                  / MIN(2022 - s.built, 32) inspectionsPerYear
  FROM          Inspection i
  JOIN          Structure s
  ON            s.number = i.structureNumber
  GROUP BY      i.structureNumber
)
```

|             ipyAvg |
|-------------------:|
| 0.9953395329608064 |

Each structure is inspected rougly once per year on average. We can compare this
later to the designated inspection frequency assigned by the NBI.

### Designated inspection frequency statistics

Each structure has a designated inspection frequency. This can change over time.
Let's look at some statistics of what these numbers look like right now.

```sql
SELECT  MIN(inspectionFrequency) AS minimum,
        MAX(inspectionFrequency) AS maximum,
        AVG(inspectionFrequency) AS average,
        (
  SELECT    inspectionFrequency
  FROM      Structure
  ORDER BY  inspectionFrequency
  LIMIT     1
  OFFSET    (SELECT COUNT(*) FROM Structure) / 2
        ) AS median,
        (
  SELECT    inspectionFrequency
  FROM      Structure
  GROUP BY  inspectionFrequency
  ORDER BY  COUNT(*) DESC
  LIMIT     1
        ) AS mode,
        (
  SELECT  SQRT(
            AVG(inspectionFrequency * inspectionFrequency) -
            AVG(inspectionFrequency) * AVG(inspectionFrequency)
          )
  FROM    Structure
        ) AS stdDev
FROM    Structure
```

| minimum | maximum |            average | median | mode |             stdDev |
|--------:|--------:|-------------------:|-------:|-----:|-------------------:|
|       3 |      48 | 23.972120566903985 |     24 |   24 | 0.6990063819353732 |

The average designated inspection frequency is roughly 24 months, or 2 years.
From this, we can expect to see approximately 0.5 inspections per year. Compare
this to our previous finding that there is 1 inspection per year on average in
the actual inspection data. Inspections are occurring twice as often as
designated.
