# NBI Data Analysis

## Prerequisites

- Node.js
- A copy of the [National Bridge Inventory (NBI) data from 1990 to 2022 for various
bridges in the state of
Georgia](https://www.kaggle.com/datasets/cynthiamengyuanli/nbi-data-1990-2022)

## Installation

Clone this repository (or download the files from GitHub's web UI)

```sh
git clone https://github.com/travishorn/nbi-data-analysis
```

Change into the directory

```sh
cd nbi-data-analysis
```

Install the dependencies

```sh
npm install
```

Migrate the database

```sh
npx knex migrate:latest
```

This will create `db.sqlite3` with a highly-optimized schema for this dataset.

Seed the database

```sh
npx knex seed:run
```

This will insert data related to NBI's condition rating system and some metadata
into the database.

The source file from Kaggle should be called `BridgesExport_AllYear.csv`.

Place the file in the `source-data` directory.

Load the data from the source file

```
node src/load-data.js
```

It may take a moment. This script is doing a lot of extraction and
transformation before loading the data into the database. Very strict checks and
foreign keys are applied to the imported data. If the structure of the source
data has changed since the creation of this project, you may need to adjust the
code in `src/load-data.js`.

When the script finishes, a SQLite database at `db.sqlite3` will be full of
bridge data from the source dataset.

![An ER diagram of the database created by the code in this
project](screenshots/er-diagram.png)

## Using

Explore the data using SQL. Here is an example:

```sql
SELECT        i.structureNumber,
              i.condition,
              s.built,
              s.latitude,
              s.longitude,
              m.name material,
              s.span,
              s.length,
              oa.name ownerAgency
FROM          Inspection i
JOIN          Structure s
ON            s.number = i.structureNumber
JOIN          Material m
ON            m.code = s.materialCode
JOIN          OwnerAgency oa
ON            oa.code = s.ownerAgencyCode
WHERE         i.year = 2022
AND           s.built >= 2012
ORDER BY      i.structureNumber DESC
```

![A table of bridge data in the U.S. state of
Georgia](screenshots/query-result.png)

You can get more information about each column from the `Metadata` table.

```sql
SELECT    m.*
FROM      Metadata m
WHERE     m.`table` = 'Inspection'
```

![A table showing the unit and description of each column in a
table](screenshots/metadata-example.png)

## License

The MIT License

Copyright 2023 Travis Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
