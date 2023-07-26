export const seed = async (knex) => {
  // Delete existing condition ratings
  await knex("ConditionRating").del();

  // Insert condition ratings as defined by NBI
  await knex("ConditionRating").insert([
    {
      code: 0,
      description: "Failed",
      detail: "Out of service; beyond corrective action",
    },
    {
      code: 1,
      description: '"Imminant" failure',
      detail:
        "Major deterioration or section loss present in critical sructural components or obvious vertical or horizontal movement affecting structure stability. Bridge is closed to traffic but corrective action may put it back in light service.",
    },
    {
      code: 2,
      description: "Critical",
      detail:
        "Advanced deterioration of primary structural elements. Fatigue cracks in steel or shear cracks in concrete may be present or scour may have removed substructure support. Unless closely monitored it may be necessary to close the bridge until corrective action is taken.",
    },
    {
      code: 3,
      description: "Serious",
      detail:
        "Loss of section, deterioration of primary structural elements. Fatigue cracks in steel or shear cracks in concrete may be present.",
    },
    {
      code: 4,
      description: "Poor",
      detail: "Advanced section loss, deterioration, spalling or scour.",
    },
    {
      code: 5,
      description: "Fair",
      detail:
        "All primary structural elements are sound but may have minor section loss, cracking, spalling or scour.",
    },
    {
      code: 6,
      description: "Satisfactory",
      detail: "Structural elements show some minor deterioration.",
    },
    {
      code: 7,
      description: "Good",
      detail: "Some minor problems.",
    },
    {
      code: 8,
      description: "Very good",
      detail: "No problems noted.",
    },
    {
      code: 9,
      description: "Excellent",
      detail: null,
    },
  ]);
};
