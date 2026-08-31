import { NextResponse } from "next/server";

/* =========================================================
   GENESIS CYCLE — AUGUST 17 → AUGUST 30
   OLD 20 QUESTIONS
========================================================= */

const genesisQuestions = [
  {
    id: 1,
    question:
      "In the xy-plane, the line with equation ax − by = 5, where a and b are constants, is perpendicular to the line with equation 11x − 4y = 5. Which equation represents a line perpendicular to 11x + 12y = 5?",
    options: [
      "ax − 3by = 5",
      "ax + 3by = 5",
      "3ax − by = 5",
      "3ax + by = 5",
    ],
    points: 10,
  },
  {
    id: 2,
    question:
      "Line r is shown in the xy-plane. Line s is parallel to line r and passes through the point (1, −1). Which point lies on line s?",
    options: [
      "(−3, −3)",
      "(−2, −2)",
      "(0, −2)",
      "(4, 0)",
    ],
    points: 10,
  },
  {
    id: 3,
    question:
      "The function f is defined by f(x) = k(1.84)ˣ, where k is a constant. The value of f(x) increases by p% for every increase of x by 1. For which function g(x), where k is a constant, does the value of g(x) increase by p% for every increase of x by 4?",
    options: [
      "g(x) = k(1.84)ˣ⁄⁴",
      "g(x) = k(1.84ˣ)⁴",
      "g(x) = k(1.84)ˣ⁻⁴",
      "g(x) = k(1.84)ˣ⁺⁴",
    ],
    points: 10,
  },
  {
    id: 4,
    question:
      "To get to work each day, Harry must travel 8 miles by bus and 16 miles by train. The bus travels at an average speed of x miles per hour and the train travels at an average speed of y miles per hour. If Harry's daily commute never takes more than 1 hour, which inequality represents the possible average speeds?",
    options: [
      "8/x + 16/y ≤ 1",
      "16/x + 8/y ≤ 1",
      "x/8 + y/16 ≤ 1",
      "8x + 16y ≤ 1",
    ],
    points: 10,
  },
  {
    id: 5,
    question:
      "A reindeer population was introduced into an area and researched for 19 years. Function P models this population t years after introduction. P(t) = 67(5/4)ᵗ. Which statement is the best interpretation of 5/4 in this context?",
    options: [
      "For every 4 reindeer in the population in a certain year, it is predicted that there will be 5 reindeer the next year.",
      "For every 5 reindeer in the population in a certain year, it is predicted that there will be 4 reindeer the next year.",
      "It is predicted that this reindeer population grows by 4 reindeer every 5 years.",
      "It is predicted that this reindeer population grows by 5 reindeer every 4 years.",
    ],
    points: 10,
  },
  {
    id: 6,
    question:
      "One of the two equations in a system of linear equations is 30x = 1,800y − 2,700. The system has no solution. Which equation could be the second equation in this system?",
    options: [
      "x/30 = 2y",
      "x/30 = 60y − 90",
      "x = 2y",
      "x = 60y − 90",
    ],
    points: 10,
  },
  {
    id: 7,
    question:
      "35x + 3 = k(7x + 3) + 7x. In the given equation, k is a constant. The equation has exactly one solution. Which value cannot be the value of k?",
    options: ["5", "4", "0", "−4"],
    points: 10,
  },
  {
    id: 8,
    question:
      "y = 2x² − 24x + 54. The given equation represents a parabola in the xy-plane. Which equation representing the same parabola displays the x-intercepts as constants or coefficients?",
    options: [
      "y = 2(x² − 12x) + 54",
      "y = 2x(x − 12) + 54",
      "y = 2(x − 6)² − 18",
      "y = 2(x − 9)(x − 3)",
    ],
    points: 10,
  },
  {
    id: 9,
    question:
      "The value of a painting increased by 179% from the end of 2017 to the end of 2018 and then decreased by 23% from the end of 2018 to the end of 2019. What was the net percentage increase in the value of the painting from the end of 2017 to the end of 2019?",
    options: ["114.83%", "137.83%", "156.00%", "243.17%"],
    points: 10,
  },
  {
    id: 10,
    question:
      "To investigate the effect of magnesium supplementation on the sleep quality of adults, a researcher selected 190 adults at random from a community center. Each participant was randomly assigned to take a magnesium supplement or a placebo each day for 6 weeks. What feature of this study allowed the researcher to conclude that the magnesium supplement caused the improved sleep quality?",
    options: [
      "There were more than 100 participants in the study.",
      "The participants were selected at random from the community center.",
      "The sleep efficiency of each participant was measured again at the end of 6 weeks.",
      "Each participant was randomly assigned to take a magnesium supplement or a placebo.",
    ],
    points: 10,
  },
  {
    id: 11,
    question:
      "In triangle JKL, the measure of angle J is (90b)°, the measure of angle K is (69a)°, and the measure of angle L is (21a)°, where a and b are constants. Which of the following must be true?",
    options: [
      "cos L > sin K",
      "cos L = sin K",
      "cos L < sin K",
      "There is not enough information to compare cos L and sin K.",
    ],
    points: 10,
  },
  {
    id: 12,
    question:
      "In triangle ABC, the measure of angle A is 56° and AC = 30. In triangle PQR, the measure of angle P is 56° and PR = 90. Which additional information is sufficient to prove that triangle ABC is similar to triangle PQR?",
    options: [
      "AB = 20 and PQ = 20.",
      "AB = 20 and QR = 60.",
      "The measures of angle B and angle R are 48° and 76°, respectively.",
      "The measures of angle B and angle Q are 56° and 48°, respectively.",
    ],
    points: 10,
  },
  {
    id: 13,
    question:
      "6x⁴ + 17x² + 5 can be rewritten as (3x² + a)(2x² + b), where a and b are positive integers, or as (3x² + c)(2x² + d), where c and d are positive non-integers. What is the value of a + c?",
    options: ["8", "17/2", "9", "19/2"],
    points: 10,
  },
  {
    id: 14,
    question:
      "A number x is at most 27 less than 3 times the value of y. If the value of y is 8, what is the greatest possible value of x?",
    options: ["−3", "3", "21", "51"],
    points: 10,
  },
  {
    id: 15,
    question:
      "In triangle RST, the length of RS is 21, and the length of ST is 9. Triangle RST is dilated by a scale factor of 1/3 to obtain triangle R′S′T′. What is the length of S′T′?",
    options: ["3", "7", "27", "63"],
    points: 10,
  },
  {
    id: 16,
    question:
      "An object's speed is increasing at a rate of 8.50 meters per second squared. What is this rate, in miles per minute squared, rounded to the nearest tenth? Use 1 mile = 1,609 meters.",
    options: ["0.3", "8.5", "19.0", "30.6"],
    points: 10,
  },
  {
    id: 17,
    question:
      "In each of the following data sets of 5 values, p is a constant. Which data set has the largest standard deviation?",
    options: [
      "p − 4, p, p, p, p + 4",
      "p − 1, p − 1, p, p + 1, p + 1",
      "p, p, p, p, p",
      "p − 5, p − 4, p, p + 4, p + 5",
    ],
    points: 10,
  },
  {
    id: 18,
    question:
      "To determine the median number of a store's visitors per day, the store owner calculated the median number of visitors for 11 consecutive Wednesdays. For these 11 Wednesdays, the median number of visitors per day was 44. Which statement is true about this sampling method?",
    options: [
      "The median number of the store's visitors per day is 44.",
      "A determination about the median should not be made because no other stores are considered.",
      "The sampling method is flawed and may produce a biased estimate of the median number of visitors per day.",
      "The sampling method is not flawed and is likely to produce an unbiased estimate.",
    ],
    points: 10,
  },
  {
    id: 19,
    question:
      "Line k contains the points (−3, −40), (v, 0), and (5, 56). What is the value of v?",
    options: ["−1/3", "1/3", "3", "10/3"],
    points: 10,
  },
  {
    id: 20,
    question:
      "A circle in the xy-plane has its center at (−1, 1). Line t is tangent to this circle at the point (7, −6). Which of the following points also lies on line t?",
    options: [
      "(0, 8/7)",
      "(6, 9)",
      "(14, 2)",
      "(15, 1)",
    ],
    points: 10,
  },
];

/* =========================================================
   INDEPENDENCE CYCLE — AUGUST 31 →
   NEW 20 QUESTIONS
========================================================= */

const independenceQuestions = [
  {
    id: 1,
    question:
      "In a set of three consecutive integers, where the integers are ordered from least to greatest, the first integer is represented by x. The sum of 4 and the second integer is less than the product of 17 and the third integer. Which inequality represents this situation?",
    options: [
      "4 + (x + 1) > 17(x + 2)",
      "4 + (x + 1) < 17(x + 2)",
      "4 + (x + 2) > 17(x + 3)",
      "4 + (x + 2) < 17(x + 3)",
    ],
    points: 10,
  },

  {
    id: 2,
    question:
      "A circle in the xy-plane has its center at (2, 9). Line t is tangent to this circle at the point (a, −4), where a is a constant. The slope of line t is 6/5. What is the value of a?",
    options: ["−68/5", "−53/6", "77/6", "88/5"],
    points: 10,
  },

  {
    id: 3,
    question:
      "A certain neighborhood had a population of 1,130 in 2006. Each year for the next 5 years the population of the neighborhood increased by approximately 4% of the population of the previous year. Which of the following equations represents the population N of the neighborhood t years after 2006, where t ≤ 5?",
    options: [
      "N = 0.04(1,130)ᵗ",
      "N = 1,130(0.04)ᵗ",
      "N = 1,130(1.04)ᵗ",
      "N = 1.04(1,130)ᵗ",
    ],
    points: 10,
  },

  {
    id: 4,
    question:
      "In the xy-plane, the graph of a line with an x-intercept of (c, 0) and a y-intercept of (0, k), where c and k are constants, can be represented by the equation 3x − 4y = 17. What is the value of c/k?",
    options: ["−4/3", "−3/4", "3/4", "4/3"],
    points: 10,
  },

  {
    id: 5,
    question:
      "In triangles ABC and XYZ, AB = 22, XY = 11, and angles A and X both measure 77°. Which of the following pieces of information, if any, would be enough to prove that the two triangles are similar to each other?",
    options: [
      "No additional information is necessary.",
      "Angle measures alone do not provide enough information.",
      "I and II together provide enough information.",
      "I and III together provide enough information.",
    ],
    points: 10,
  },

  {
    id: 6,
    question:
      "If |x − 1| = 8 and x is a solution to the given equation, what is a possible value of x − 1?",
    options: ["−8", "−6", "6", "7"],
    points: 10,
  },

  {
    id: 7,
    question:
      "One of the two equations in a linear system is 2x + 2y = 2. The system has no solution. Which equation could be the other equation in the system?",
    options: [
      "3x − 3y = 3",
      "3x + 3y = 3",
      "2x − 2y = 2",
      "2x + 2y = 3",
    ],
    points: 10,
  },

  {
    id: 8,
    question:
      "Line h is defined by y = −8x + 7. What is the slope of a line that is perpendicular to line h in the xy-plane?",
    options: ["1/8", "−8", "8", "−1/8"],
    points: 10,
  },

  {
    id: 9,
    question:
      "x² − 10x + 14 = 0. One solution to the given equation can be written as x = 5 + √n, where n is a constant. What is the value of n?",
    options: ["11", "12", "13", "14"],
    points: 10,
  },

  {
    id: 10,
    question:
      "Scientists took 94 ice core sections from a glacier. Each section was in the shape of a right circular cylinder and had a length of 1 meter and a diameter of 0.1 meter. Which of the following is closest to the volume, in cubic meters, of the 94 sections?",
    options: ["30", "7", "3", "0.7"],
    points: 10,
  },

  {
    id: 11,
    question:
      "4(x + 1) = 6 + 2(x + 1). If x is the solution to the given equation, what is the value of x + 1?",
    options: ["1", "3", "4", "6"],
    points: 10,
  },

  {
    id: 12,
    question:
      "In a forest, while pine trees between 15 and 45 years old grew 36 to 48 inches in height each year. A 15-year-old white pine tree growing in the forest was 240 inches tall. Which of the following inequalities gives all possible values for the tree's height h, in inches, at the end of its 45th year?",
    options: [
      "h ≤ 540",
      "h ≥ 2,160",
      "240 ≤ h ≤ 1,080",
      "1,320 ≤ h ≤ 1,680",
    ],
    points: 10,
  },

  {
    id: 13,
    question:
      "x + y = 10 and x − y = 4. The solution to the given system of equations is (x, y). What is the value of 2x?",
    options: ["14", "7", "3", "6"],
    points: 10,
  },

  {
    id: 14,
    question:
      "If 3√(x − 4) + 10 = 22, what is the value of x − 3?",
    options: ["17", "10", "20", "6"],
    points: 10,
  },

  {
    id: 15,
    question:
      "The equation 2x + 30y = 4,700 models the total number of trees in a neighborhood consisting of a 2-hectare park and a 30-hectare residential area. What is the best interpretation of x in this context?",
    options: [
      "The total number of trees in the park",
      "The number of trees per hectare in the park",
      "The total number of trees in the residential area",
      "The number of trees per hectare in the residential area",
    ],
    points: 10,
  },

  {
    id: 16,
    question:
      "Line l in the xy-plane contains the points (0, −2) and (10, 4). An equation of line l is y = mx + b, where m and b are constants. What is the value of m?",
    options: ["5/3", "3/5", "−3/5", "−5/3"],
    points: 10,
  },

  {
    id: 17,
    question:
      "A dance studio had x students when it opened. One year later, the studio had 1.2x students. If the number of students in the studio increased by p% during this one-year period, what is the value of p?",
    options: ["20", "2", "0.2", "12"],
    points: 10,
  },

  {
    id: 18,
    type: "image",
    image: "/sat/independence/q18.png",
    question:
      "In the figure above, △ABC and △BCD are right triangles, AD = 8, and BD = 6. What is the length of DC?",
    options: ["9/4", "9/2", "9", "18"],
    points: 10,
  },

  {
    id: 19,
    type: "table",
    question:
      "Four values of x and their corresponding values of g(x) are shown in the table above for the linear function g. The equation g(x) = cx + d defines function g, and c and d are constants. What is the value of c + d?",
    table: {
      headers: ["x", "2", "4", "6", "8"],
      rows: [
        ["g(x)", "46", "0", "−46", "−92"],
      ],
    },
    options: ["−23", "69", "92", "115"],
    points: 10,
  },

  {
    id: 20,
    type: "math",
    question:
      "What is the value of 2^((a − 1)(a + 1)) / 2^((a − 2)(a + 2))?",
    options: ["1/16", "1/8", "8", "16"],
    points: 10,
  },
];

/* =========================================================
   ANSWERS
========================================================= */

const genesisAnswers: Record<number, string> = {
  1: "C",
  2: "A",
  3: "A",
  4: "A",
  5: "A",
  6: "A",
  7: "B",
  8: "D",
  9: "A",
  10: "D",
  11: "B",
  12: "C",
  13: "B",
  14: "A",
  15: "A",
  16: "C",
  17: "D",
  18: "C",
  19: "A",
  20: "C",
};

const independenceAnswers: Record<number, string> = {
  1: "B",
  2: "D",
  3: "C",
  4: "A",
  5: "D",
  6: "A",
  7: "D",
  8: "A",
  9: "D",
  10: "D",
  11: "B",
  12: "D",
  13: "A",
  14: "A",
  15: "B",
  16: "B",
  17: "A",
  18: "B",
  19: "B",
  20: "C",
};

/* =========================================================
   TASHKENT DATE
========================================================= */

function getTashkentDate() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  return { year, month, day };
}


export async function GET() {
  const { month, day } = getTashkentDate();

  let cycle: "genesis" | "independence";
  let questions;


  if (month === 8 && day >= 31) {
    cycle = "independence";
    questions = independenceQuestions;
  } else {
    cycle = "genesis";
    questions = genesisQuestions;
  }

  return NextResponse.json({
    success: true,
    cycle,
    cycleName:
      cycle === "genesis" ? "Genesis Cycle" : "Independence Cycle",
    questions,
  });
}