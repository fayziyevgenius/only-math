export type Category =
  | "certificate"
  | "olympiad"
  | "sat";

export type DailyCycle =
  | "genesis"
  | "independence";

export type DailyQuestion = {
  id: number;
  day: number;
  cycle: DailyCycle;
  category: Category;
  title: string;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;

  table?: {
    headers: string[];
    rows: string[][];
  };
};

/* =========================================================
   CYCLE DATES
========================================================= */

export const GENESIS_START_DATE =
  "2026-08-17";

export const GENESIS_END_DATE =
  "2026-08-30";

export const INDEPENDENCE_START_DATE =
  "2026-08-31";

export const INDEPENDENCE_END_DATE =
  "2026-09-13";

/* =========================================================
   DAILY QUESTIONS
========================================================= */

export const dailyQuestions: DailyQuestion[] = [
  /* =======================================================
     GENESIS CYCLE
     17 AUGUST — 30 AUGUST
  ======================================================= */

  {
    id: 1,
    day: 1,
    cycle: "genesis",
    category: "sat",
    title: "SAT",
    question:
      "The table shows three values of x and their corresponding values of y, where a and b are constants. There is a linear relationship between x and y. In the xy-plane, the y-intercept of the line representing this relationship is (0, −14). What is the value of a + b?",
    options: [
      "−30",
      "−29",
      "−20",
      "−19",
    ],
    correctAnswer: "−29",
    points: 20,
    table: {
      headers: ["x", "y"],
      rows: [
        ["−12", "46"],
        ["a", "16"],
        ["2", "b"],
      ],
    },
  },

  {
    id: 2,
    day: 2,
    cycle: "genesis",
    category: "olympiad",
    title: "Olympiad",
    question:
      "Quyida har biri 10 ta elementdan iborat 100 ta to'plam berilgan: {1, 2, 3, ..., 10}, {11, 12, 13, ..., 20}, ... , {991, 992, 993, ..., 1000}. Bu to'plamlarning nechtasida aynan 2 ta 7 ga karrali son bor?",
    options: [
      "10",
      "14",
      "15",
      "16",
    ],
    correctAnswer: "15",
    points: 30,
  },

  {
    id: 3,
    day: 3,
    cycle: "genesis",
    category: "certificate",
    title: "Certificate",
    question:
      "Hadlari bir-biridan farqli bo'lgan arifmetik progressiya hadlari uchun a₁ = 2·(a₁₂ − a₁₁) va a₈ = a₂·a₅ tenglik o'rinli bo'lsa, a₇ ni toping.",
    options: [
      "1",
      "2",
      "3",
      "4",
    ],
    correctAnswer: "2",
    points: 20,
  },

  {
    id: 4,
    day: 4,
    cycle: "genesis",
    category: "sat",
    title: "SAT",
    question:
      "If 3x + 7 = 25, what is the value of x?",
    options: [
      "4",
      "5",
      "6",
      "7",
    ],
    correctAnswer: "6",
    points: 20,
  },

  {
    id: 5,
    day: 5,
    cycle: "genesis",
    category: "olympiad",
    title: "Olympiad",
    question:
      "Agar x + y = 10 va xy = 21 bo'lsa, x² + y² ning qiymatini toping.",
    options: [
      "42",
      "58",
      "79",
      "100",
    ],
    correctAnswer: "58",
    points: 30,
  },

  {
    id: 6,
    day: 6,
    cycle: "genesis",
    category: "certificate",
    title: "Certificate",
    question:
      "Agar 2x − 5 = 17 bo'lsa, x ning qiymatini toping.",
    options: [
      "9",
      "10",
      "11",
      "12",
    ],
    correctAnswer: "11",
    points: 20,
  },

  {
    id: 7,
    day: 7,
    cycle: "genesis",
    category: "sat",
    title: "SAT",
    question:
      "A line has slope 4 and passes through the point (2, 7). What is the y-intercept of the line?",
    options: [
      "−1",
      "−2",
      "1",
      "2",
    ],
    correctAnswer: "−1",
    points: 20,
  },

  {
    id: 8,
    day: 8,
    cycle: "genesis",
    category: "olympiad",
    title: "Olympiad",
    question:
      "1 dan 100 gacha bo'lgan natural sonlardan 3 ga ham, 5 ga ham bo'linmaydigan nechta son mavjud?",
    options: [
      "53",
      "54",
      "55",
      "56",
    ],
    correctAnswer: "53",
    points: 30,
  },

  {
    id: 9,
    day: 9,
    cycle: "genesis",
    category: "certificate",
    title: "Certificate",
    question:
      "Geometrik progressiyaning birinchi hadi 3, maxraji 2 ga teng. Uning uchinchi hadini toping.",
    options: [
      "6",
      "9",
      "12",
      "15",
    ],
    correctAnswer: "12",
    points: 20,
  },

  {
    id: 10,
    day: 10,
    cycle: "genesis",
    category: "sat",
    title: "SAT",
    question:
      "A rectangle has a length of 12 and a width of 5. What is the area of the rectangle?",
    options: [
      "17",
      "34",
      "60",
      "120",
    ],
    correctAnswer: "60",
    points: 20,
  },

  {
    id: 11,
    day: 11,
    cycle: "genesis",
    category: "olympiad",
    title: "Olympiad",
    question:
      "Natural n son uchun n² − n soni har doim qaysi songa bo'linadi?",
    options: [
      "2",
      "3",
      "5",
      "7",
    ],
    correctAnswer: "2",
    points: 30,
  },

  {
    id: 12,
    day: 12,
    cycle: "genesis",
    category: "certificate",
    title: "Certificate",
    question:
      "x² − 9 = 0 tenglamaning ildizlari yig'indisini toping.",
    options: [
      "−6",
      "−3",
      "0",
      "6",
    ],
    correctAnswer: "0",
    points: 20,
  },

  {
    id: 13,
    day: 13,
    cycle: "genesis",
    category: "sat",
    title: "SAT",
    question:
      "If f(x) = 2x + 3, what is the value of f(5)?",
    options: [
      "10",
      "11",
      "13",
      "15",
    ],
    correctAnswer: "13",
    points: 20,
  },

  {
    id: 14,
    day: 14,
    cycle: "genesis",
    category: "olympiad",
    title: "Olympiad",
    question:
      "Musbat a va b sonlar uchun a + b = 10. ab ning eng katta qiymatini toping.",
    options: [
      "20",
      "24",
      "25",
      "30",
    ],
    correctAnswer: "25",
    points: 30,
  },

  /* =======================================================
     INDEPENDENCE CYCLE
     31 AUGUST — 13 SEPTEMBER
  ======================================================= */

  {
    id: 101,
    day: 1,
    cycle: "independence",
    category: "olympiad",
    title: "Olympiad",
    question:
      "Ketma-ket kelgan 4 ta natural sonning ko'paytmasiga 1 qo'shilganda 3025 hosil bo'ldi. Ushbu sonlarning eng kichigini toping.",
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: "6",
    points: 30,
  },

  {
    id: 102,
    day: 2,
    cycle: "independence",
    category: "sat",
    title: "SAT",
    question:
      "If 3x+5=20, what is the value of 6x−2?",
    options: [
      "28",
      "30",
      "32",
      "34",
    ],
    correctAnswer: "28",
    points: 20,
  },

  {
    id: 103,
    day: 3,
    cycle: "independence",
    category: "certificate",
    title: "Certificate",
    question:
      "x²−7x+12=0 kvadrat tenglamaning ildizlari yig'indisini toping.",
    options: [
      "-7",
      "7",
      "12",
      "-12",
    ],
    correctAnswer: "7",
    points: 20,
  },

  {
    id: 104,
    day: 4,
    cycle: "independence",
    category: "olympiad",
    title: "Olympiad",
    question:
      "Agar x + 1/x = 5 bo'lsa, x² + 1/x² ning qiymatini toping.",
    options: [
      "23",
      "25",
      "27",
      "21",
    ],
    correctAnswer: "23",
    points: 30,
  },

  {
    id: 105,
    day: 5,
    cycle: "independence",
    category: "sat",
    title: "SAT",
    question:
      "A line in the xy-plane passes through the points (0,4) and (3,10). What is the slope of the line?",
    options: [
      "2",
      "3",
      "4",
      "6",
    ],
    correctAnswer: "2",
    points: 20,
  },

  {
    id: 106,
    day: 6,
    cycle: "independence",
    category: "certificate",
    title: "Certificate",
    question:
      "Tengsizlikni yeching: 3x−7<8",
    options: [
      "x<5",
      "x>5",
      "x<15",
      "x>15",
    ],
    correctAnswer: "x<5",
    points: 20,
  },

  {
    id: 107,
    day: 7,
    cycle: "independence",
    category: "olympiad",
    title: "Olympiad",
    question:
      "2²⁰²⁶ sonining oxirgi raqamini toping.",
    options: [
      "2",
      "4",
      "6",
      "8",
    ],
    correctAnswer: "4",
    points: 30,
  },

  {
    id: 108,
    day: 8,
    cycle: "independence",
    category: "sat",
    title: "SAT",
    question:
      "If f(x)=2x²−3x+1, what is the value of f(4)?",
    options: [
      "19",
      "21",
      "25",
      "27",
    ],
    correctAnswer: "21",
    points: 20,
  },

  {
    id: 109,
    day: 9,
    cycle: "independence",
    category: "certificate",
    title: "Certificate",
    question:
      "Birinchi hadi a₁=3 va ayirmasi d=4 bo'lgan arifmetik progressiyaning 10-hadini toping.",
    options: [
      "37",
      "39",
      "43",
      "40",
    ],
    correctAnswer: "39",
    points: 20,
  },

  {
    id: 110,
    day: 10,
    cycle: "independence",
    category: "olympiad",
    title: "Olympiad",
    question:
      "Agar x³+y³=35 va x+y=5 bo'lsa, xy ko'paytmaning qiymatini toping.",
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: "6",
    points: 30,
  },

  {
    id: 111,
    day: 11,
    cycle: "independence",
    category: "sat",
    title: "SAT",
    question:
      "A store discounts a $120 jacket by 25%. What is the sale price of the jacket?",
    options: [
      "$80",
      "$90",
      "$95",
      "$100",
    ],
    correctAnswer: "$90",
    points: 20,
  },

  {
    id: 112,
    day: 12,
    cycle: "independence",
    category: "certificate",
    title: "Certificate",
    question:
      "Radiusi 6 cm bo'lgan doiraning yuzini toping.",
    options: [
      "12π",
      "18π",
      "24π",
      "36π",
    ],
    correctAnswer: "36π",
    points: 20,
  },

  {
    id: 113,
    day: 13,
    cycle: "independence",
    category: "olympiad",
    title: "Olympiad",
    question:
      "x²+y²−6x+8y+25=0 tenglamani qanoatlantiruvchi (x,y) sonlar juftligi uchun x+y yig'indini toping.",
    options: [
      "-1",
      "1",
      "7",
      "-7",
    ],
    correctAnswer: "-1",
    points: 30,
  },

  {
    id: 114,
    day: 14,
    cycle: "independence",
    category: "sat",
    title: "SAT",
    question:
      "If x²−y²=28 and x−y=4, what is the value of x+y?",
    options: [
      "6",
      "7",
      "8",
      "14",
    ],
    correctAnswer: "7",
    points: 20,
  },
];

/* =========================================================
   GET QUESTION
========================================================= */

export function getQuestionForDay(
  cycle: DailyCycle,
  day: number
): DailyQuestion | null {
  return (
    dailyQuestions.find(
      (question) =>
        question.cycle === cycle &&
        question.day === day
    ) ?? null
  );
}

/* =========================================================
   DATE HELPERS
========================================================= */

function dateToUtc(dateKey: string) {
  return new Date(
    `${dateKey}T00:00:00Z`
  );
}

/* =========================================================
   GET ACTIVE CYCLE
========================================================= */

export function getCycleForDate(
  dateKey: string
): {
  cycle: DailyCycle;
  name: string;
  day: number;
} | null {
  const current =
    dateToUtc(dateKey);

  const genesisStart =
    dateToUtc(
      GENESIS_START_DATE
    );

  const genesisEnd =
    dateToUtc(
      GENESIS_END_DATE
    );

  const independenceStart =
    dateToUtc(
      INDEPENDENCE_START_DATE
    );

  const independenceEnd =
    dateToUtc(
      INDEPENDENCE_END_DATE
    );

  /* =======================================================
     GENESIS
  ======================================================= */

  if (
    current >= genesisStart &&
    current <= genesisEnd
  ) {
    const difference =
      current.getTime() -
      genesisStart.getTime();

    const day =
      Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ) + 1;

    return {
      cycle: "genesis",
      name: "Genesis Cycle",
      day,
    };
  }

  /* =======================================================
     INDEPENDENCE
  ======================================================= */

  if (
    current >= independenceStart &&
    current <= independenceEnd
  ) {
    const difference =
      current.getTime() -
      independenceStart.getTime();

    const day =
      Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ) + 1;

    return {
      cycle: "independence",
      name: "Independence Cycle",
      day,
    };
  }

  return null;
}