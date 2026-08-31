export type Category =
  | "certificate"
  | "olympiad"
  | "sat";

export type DailyQuestion = {
  id: number;
  day: number;
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

export const GENESIS_START_DATE = "2026-08-17";
export const GENESIS_END_DATE = "2026-08-30";

export const dailyQuestions: DailyQuestion[] = [
  // =====================================================
  // DAY 1 — SAT
  // 17 AUGUST
  // =====================================================
  {
    id: 1,
    day: 1,
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

  // =====================================================
  // DAY 2 — OLYMPIAD
  // 18 AUGUST
  // =====================================================
  {
    id: 2,
    day: 2,
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

  // =====================================================
  // DAY 3 — CERTIFICATE
  // 19 AUGUST
  // =====================================================
  {
    id: 3,
    day: 3,
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

  // =====================================================
  // DAY 4 — SAT
  // 20 AUGUST
  // =====================================================
  {
    id: 4,
    day: 4,
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

  // =====================================================
  // DAY 5 — OLYMPIAD
  // 21 AUGUST
  // =====================================================
  {
    id: 5,
    day: 5,
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

  // =====================================================
  // DAY 6 — CERTIFICATE
  // 22 AUGUST
  // =====================================================
  {
    id: 6,
    day: 6,
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

  // =====================================================
  // DAY 7 — SAT
  // 23 AUGUST
  // =====================================================
  {
    id: 7,
    day: 7,
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

  // =====================================================
  // DAY 8 — OLYMPIAD
  // 24 AUGUST
  // =====================================================
  {
    id: 8,
    day: 8,
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

  // =====================================================
  // DAY 9 — CERTIFICATE
  // 25 AUGUST
  // =====================================================
  {
    id: 9,
    day: 9,
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

  // =====================================================
  // DAY 10 — SAT
  // 26 AUGUST
  // =====================================================
  {
    id: 10,
    day: 10,
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

  // =====================================================
  // DAY 11 — OLYMPIAD
  // 27 AUGUST
  // =====================================================
  {
    id: 11,
    day: 11,
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

  // =====================================================
  // DAY 12 — CERTIFICATE
  // 28 AUGUST
  // =====================================================
  {
    id: 12,
    day: 12,
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

  // =====================================================
  // DAY 13 — SAT
  // 29 AUGUST
  // =====================================================
  {
    id: 13,
    day: 13,
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

  // =====================================================
  // DAY 14 — OLYMPIAD
  // 30 AUGUST
  // =====================================================
  {
    id: 14,
    day: 14,
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
];

export function getQuestionForDay(
  day: number
): DailyQuestion | null {
  return (
    dailyQuestions.find(
      (question) => question.day === day
    ) ?? null
  );
}