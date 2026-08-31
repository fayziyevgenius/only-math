import { NextResponse } from "next/server";

/* =========================================================
   QUESTION TYPE
========================================================= */

type Question = {
  id: number;
  question: string;
  options: string[];
  points: number;
  image?: string;
};

/* =========================================================
   GENESIS
   17 AUGUST 2026 → 30 AUGUST 2026
========================================================= */

const genesisQuestions: Question[] = [
  {
    id: 1,
    question:
      "Rasmda AB || ED bo'lsa, x burchak qiymatini toping.",
    options: [
      "50°",
      "30°",
      "35°",
      "20°",
    ],
    points: 30,
    image: "/certificate/q1.png",
  },

  {
    id: 2,
    question:
      "Tengsizlikning natural yechimlari nechta?",
    options: [
      "10",
      "4",
      "8",
      "6",
    ],
    points: 30,
  },

  {
    id: 3,
    question:
      "Tengsizlikni qanoatlantiradigan butun sonlar nechta?",
    options: [
      "8",
      "9",
      "10",
      "11",
    ],
    points: 30,
  },

  {
    id: 4,
    question:
      "Agar 2^a = 5, 2^b = 3 bo'lsa, c ni a va b orqali ifodalang.",
    options: [
      "(b + 4a) / (2a - b)",
      "(4b + a) / (2a + b)",
      "(4b + a) / (2a - b)",
      "(4b - a) / (2a - b)",
    ],
    points: 30,
  },

  {
    id: 5,
    question:
      "Ketma-ketlikning barcha hadlari yig'indisini toping.",
    options: [
      "6",
      "1",
      "2",
      "3",
    ],
    points: 30,
  },

  {
    id: 6,
    question:
      "Hisoblang: √(√47 − √31) · √(√47 + √31)",
    options: [
      "7",
      "5",
      "6",
      "4",
    ],
    points: 30,
  },

  {
    id: 7,
    question:
      "ABC uchburchakda AD, BN, CM medianalar kesishgan nuqta G nuqta bo'lsin. Agar ABC uchburchak yuzasi 48 ga teng bo'lsa, GDN uchburchak yuzasini toping.",
    options: [
      "5",
      "4",
      "3",
      "12",
    ],
    points: 30,
    image: "/certificate/q7.png",
  },

  {
    id: 8,
    question:
      "Aylanada A, B, C, D nuqtalar olingan. O — aylana markazi, A va D nuqtalar bir to'g'ri chiziqda yotadi. Agar ∠ABC = 30° va OD = 3 bo'lsa, CD ni toping.",
    options: [
      "3",
      "4",
      "√3",
      "3√3",
    ],
    points: 30,
    image: "/certificate/q8.png",
  },

  {
    id: 9,
    question:
      "Agar aholining elektr energiyasiga talabi har yili 2,5% ortsa, necha yilda 9 marta ortadi?",
    options: [
      "log₉(1,025)",
      "log₉(0,025)",
      "log₁.₀₂₅(9)",
      "log₀.₀₂₅(9)",
    ],
    points: 30,
  },

  {
    id: 10,
    question:
      "Tengsizlikning [2; 2023] oralig'ida nechta natural yechimi bor?",
    options: [
      "2021",
      "2023",
      "0",
      "2022",
    ],
    points: 30,
  },

  {
    id: 11,
    question:
      "Tenglamani yeching: x + x/(1+2) + x/(1+2+3) + ... + x/(1+2+3+...+7) = 7",
    options: [
      "5",
      "4",
      "3",
      "2",
    ],
    points: 30,
  },

  {
    id: 12,
    question:
      "ABC to'g'ri burchakli uchburchakning C to'g'ri burchak uchidan AB gipotenuzaga parallel tekislik o'tkazilgan. Tekislikdan gipotenuzagacha bo'lgan eng qisqa masofa 12 ga teng. Katetlarning tekislikdagi proyeksiyalari 16 va 9 ga teng bo'lsa, AB gipotenuza uzunligini toping.",
    options: [
      "25",
      "30",
      "24",
      "32",
    ],
    points: 30,
  },

  {
    id: 13,
    question:
      "A = {a, b, c, d, m, n} va B = {a, b, c, k, l, m} to'plamlar berilgan. A ∩ B to'plamning bo'sh bo'lmagan qism to'plamlari soni nechta?",
    options: [
      "10",
      "8",
      "15",
      "16",
    ],
    points: 30,
  },

  {
    id: 14,
    question:
      "30 bilan 86 sonlar orasiga 7 ta son shunday joylashtirildiki, ular berilgan sonlar bilan birga arifmetik progressiyani tashkil qiladi. Qo'yilgan sonlar yig'indisini toping.",
    options: [
      "204",
      "302",
      "406",
      "248",
    ],
    points: 30,
  },

  {
    id: 15,
    question:
      "Radiusi 4 ga teng aylanaga muntazam o'nikkiburchak ichki chizilgan. O'nikkiburchakning yuzini toping.",
    options: [
      "24",
      "48",
      "64",
      "80",
    ],
    points: 30,
  },

  {
    id: 16,
    question:
      "Raqamlari 6 dan kichik bo'lmagan uch xonali 3 ga bo'linadigan natural sonlar nechta?",
    options: [
      "18",
      "20",
      "22",
      "12",
    ],
    points: 30,
  },

  {
    id: 17,
    question:
      "A shahardan B shaharga 1-avtomobil o'zgarmas 120 km/h tezlik bilan, 10 daqiqadan so'ng 2-avtomobil 150 km/h tezlik bilan yo'lga chiqdi. Ular B shaharga bir vaqtda yetib keldi. A va B shaharlar orasidagi masofani toping.",
    options: [
      "100",
      "120",
      "50",
      "60",
    ],
    points: 30,
  },

  {
    id: 18,
    question:
      "To'g'ri to'rtburchakning eni 25% ga, bo'yi 20% ga ortgan bo'lsa, yuzi necha foizga ortgan?",
    options: [
      "45%",
      "50%",
      "60%",
      "5%",
    ],
    points: 30,
  },

  {
    id: 19,
    question:
      "Bir oilaning oylik maoshi 15 000 000 so'm. Uning 60% i oilaviy xarajatlarga sarflanar edi. Qolgan pulning 30% ni bankka omonatga qo'yadi. Oila bankka necha so'm pul qo'ygan?",
    options: [
      "1 800 000",
      "2 000 000",
      "2 500 000",
      "2 200 000",
    ],
    points: 30,
  },

  {
    id: 20,
    question:
      "Arifmetik progressiyada a₁ + a₃ + a₅ + ... + a₂ₙ₋₁ = 96, aₙ₋₂ + aₙ₊₂ = 12 bo'lsa, n ning qiymatini toping.",
    options: [
      "8",
      "32",
      "24",
      "16",
    ],
    points: 30,
  },
];

/* =========================================================
   INDEPENDENCE
   31 AUGUST 2026 → 13 SEPTEMBER 2026

   AYNAN USER YUBORGAN 20 TA SAVOL
========================================================= */

const independenceQuestions: Question[] = [

  /* =======================================================
     1
  ======================================================= */

  {
    id: 1,
    question:
      "7²⁰¹⁸ sonining o'nlar xonasidagi raqamini toping?",
    options: [
      "0",
      "3",
      "4",
      "1",
    ],
    points: 30,
  },

  /* =======================================================
     2
  ======================================================= */

  {
    id: 2,
    question:
      "702, 787 va 855 sonlarini m ga bo'linganda bir xil r qoldiq qoladi. 412, 722 va 815 sonlarini n ga bo'lganda bir xil s (s ≠ r) qoldiq qoladi. m + n + r + s ni toping?",
    options: [
      "63",
      "65",
      "62",
      "61",
    ],
    points: 30,
  },

  /* =======================================================
     3
  ======================================================= */

  {
    id: 3,
    question:
      "Quyidagi sonlardan eng kichigini toping?",
    options: [
      "√55 − √52",
      "√56 − √53",
      "77 − 74",
      "88 − 85",
    ],
    points: 30,
  },

  /* =======================================================
     4
  ======================================================= */

  {
    id: 4,
    question:
      "2²⁹ sonining o'nli yozuvida barcha 10 ta raqamdan faqat bittasi ishtirok etmaydi. Ushbu ishtirok etmagan raqamni toping?",
    options: [
      "5",
      "3",
      "4",
      "7",
    ],
    points: 30,
  },

  /* =======================================================
     5
  ======================================================= */

  {
    id: 5,
    question:
      "y/(x−z) = (x+y)/z = x/y bo'lsa, x/y ni toping.",
    options: [
      "3",
      "1/2",
      "2/3",
      "2",
    ],
    points: 30,
  },

  /* =======================================================
     6
  ======================================================= */

  {
    id: 6,
    question:
      "Agar to'rtburchakning ketma-ket tomonlari 70, 90, 130, 110 ga teng bo'lib, bu to'rtburchakka tashqi va ichki aylana chizish mumkin bo'lsa. Ichki chizilgan aylana uzunligi 130 ga teng tomonga uringan nuqtada uni x va y uzunlikdagi kesmalarga bo'ladi. |x − y| ni toping?",
    options: [
      "13",
      "12",
      "14",
      "15",
    ],
    points: 30,
  },

  /* =======================================================
     7
  ======================================================= */

  {
    id: 7,
    question:
      "Ikkita basseyn bo'sh bo'lgan holatida, 7 ta teng quvvatli quvur birinchi basseynga ulandi. Birinchi basseyn 1/4 qismi to'lgach, 3 ta quvur olinib ikkinchi basseynni to'ldirishga ulandi. Birinchi basseyn 1/2 qismi to'lgach yana ikkita quvur olinib ikkinchi basseynni to'ldirishga ulandi. Bu ishlardan keyin ikki basseyn ham bir vaqtda to'ldi. Birinchi basseyn va ikkinchi basseyn sig'imlari nisbatini toping?",
    options: [
      "16/23",
      "7/16",
      "7/23",
      "9/16",
    ],
    points: 30,
  },

  /* =======================================================
     8
  ======================================================= */

  {
    id: 8,
    question:
      "Quyidagi sonlardan eng kattasini toping?",
    options: [
      "30³⁰",
      "50¹⁰",
      "40²⁰",
      "45¹⁵",
    ],
    points: 30,
  },

  /* =======================================================
     9
  ======================================================= */

  {
    id: 9,
    question:
      "Ushbu ikki tenglama umumiy ildizga ega bo'ladigan k ning mumkin bo'lgan qiymatlari yig'indisini toping:\n\nx² − 3x + 2 = 0\n\nva\n\nx² − 5x + k = 0",
    options: [
      "6",
      "8",
      "10",
      "12",
    ],
    points: 30,
  },

  /* =======================================================
     10
  ======================================================= */

  {
    id: 10,
    question:
      "Agar (x + 2)(x + b) = x² + cx + 6 tenglik o'rinli bo'lsa, c ning qiymatini toping?",
    options: [
      "−5",
      "−3",
      "3",
      "5",
    ],
    points: 30,
  },

  /* =======================================================
     11 — RASMLI SAVOL
  ======================================================= */

  {
    id: 11,
    question:
      "To'g'ri burchakli ABC da, AC = 12, BC = 5, C to'g'ri burchak. Yarim doira chizmadagidek chizilgan, ushbu yarim doira radiusini toping?",
    options: [
      "7/6",
      "13/5",
      "59/18",
      "10/3",
    ],
    points: 30,

    // Agar rasm mavjud bo'lsa:
    // image: "/certificate/independence/q11.png",
  },

  /* =======================================================
     12 — RASMLI SAVOL
  ======================================================= */

  {
    id: 12,
    question:
      "Quyidagi tenglamaning ildizlari yig'indisini toping:\n\n⁴√x = 12 / (7 − ⁴√x)",
    options: [
      "307",
      "337",
      "377",
      "317",
    ],
    points: 30,

    // image: "/certificate/independence/q12.png",
  },

  /* =======================================================
     13 — RASMLI SAVOL
  ======================================================= */

  {
    id: 13,
    question:
      "Hisoblang:\n\n√(31 · 30 · 29 · 28 + 1)",
    options: [
      "869",
      "879",
      "859",
      "849",
    ],
    points: 30,

    // image: "/certificate/independence/q13.png",
  },

  /* =======================================================
     14 — RASMLI SAVOL
  ======================================================= */

  {
    id: 14,
    question:
      "Hisoblang:\n\nlog₃7 · log₅9 · log₇11 · log₉13 · ... · log₂₃27",
    options: [
      "3",
      "10",
      "6",
      "9",
    ],
    points: 30,

    // image: "/certificate/independence/q14.png",
  },

  /* =======================================================
     15 — RASMLI SAVOL
  ======================================================= */

  {
    id: 15,
    question:
      "Hisoblang:\n\n20 + 20 1/5 + 20 2/5 + ... + 40",
    options: [
      "3000",
      "3030",
      "3150",
      "4100",
    ],
    points: 30,

    // image: "/certificate/independence/q15.png",
  },

  /* =======================================================
     16 — RASMLI SAVOL
  ======================================================= */

  {
    id: 16,
    question:
      "Hisoblang:\n\n1/2 + 4/2² + 9/2³ + 16/2⁴ + ...",
    options: [
      "4",
      "2",
      "1",
      "6",
    ],
    points: 30,

    // image: "/certificate/independence/q16.png",
  },

  /* =======================================================
     17 — 23 (BIRINCHI)
  ======================================================= */

  {
    id: 17,
    question:
      "a, b, c haqiqiy sonlar uchun:\n\nac/(a+b) + ba/(b+c) + cb/(c+a) = −9\n\nva\n\nbc/(a+b) + ca/(b+c) + ab/(c+a) = 10\n\nbo'lsa,\n\nb/(a+b) + c/(b+c) + a/(c+a)\n\nning qiymatini toping?",
    options: [
      "13",
      "17",
      "11",
      "19",
    ],
    points: 30,

    // image: "/certificate/independence/q17.png",
  },

  /* =======================================================
     18 — 23 (IKKINCHI)
  ======================================================= */

  {
    id: 18,
    question:
      "Agar x, y va z lar 1 dan katta va bu yerda w musbat son uchun logₓw = 24, logᵧw = 40 va logₓᵧ𝓏w = 12 bo'lsa, log𝓏w ning qiymatini toping?",
    options: [
      "50",
      "25",
      "40",
      "60",
    ],
    points: 30,

    // image: "/certificate/independence/q18.png",
  },

  /* =======================================================
     19 — 24
  ======================================================= */

  {
    id: 19,
    question:
      "Hisoblang:\n\n(3! + 4!)/(2(1! + 2!)) + (4! + 5!)/(3(2! + 3!)) + ... + (12! + 13!)/(11(10! + 11!))",
    options: [
      "90",
      "95",
      "100",
      "105",
    ],
    points: 30,

    // image: "/certificate/independence/q19.png",
  },

  /* =======================================================
     20 — 26
  ======================================================= */

  {
    id: 20,
    question:
      "Quyidagi tenglamaning ildizlari ko'paytmasini toping:\n\nx² + 18x + 30 = 2√(x² + 18x + 45)",
    options: [
      "18",
      "15",
      "20",
      "24",
    ],
    points: 30,

    // image: "/certificate/independence/q20.png",
  },
];

/* =========================================================
   GET CURRENT CYCLE
========================================================= */

function getUzbekistanDate() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

/* =========================================================
   GET
========================================================= */

export async function GET() {
  try {
    const today = getUzbekistanDate();

    /* =====================================================
       GENESIS
    ===================================================== */

    if (
      today >= "2026-08-17" &&
      today <= "2026-08-30"
    ) {
      return NextResponse.json(
        {
          success: true,
          available: true,
          cycle: "genesis",
          title: "Genesis Certificate",
          questions: genesisQuestions,
        },
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    /* =====================================================
       INDEPENDENCE
    ===================================================== */

    if (
      today >= "2026-08-31" &&
      today <= "2026-09-13"
    ) {
      return NextResponse.json(
        {
          success: true,
          available: true,
          cycle: "independence",
          title: "Independence Certificate",
          questions: independenceQuestions,
        },
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    /* =====================================================
       OUTSIDE CYCLE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,
        available: false,
        cycle: null,
        title: null,
        questions: [],
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Certificate Questions API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        available: false,
        error: "Server Error",
        questions: [],
      },
      {
        status: 500,
      }
    );
  }
}