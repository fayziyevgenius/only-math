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
   GENESIS CYCLE
   17 AUGUST 2026 → 30 AUGUST 2026

   GENESIS UCHUN YANGI 20 TA SAVOL
========================================================= */

const genesisQuestions: Question[] = [
  {
    id: 1,
    question:
      "Barcha raqamlari 7 dan oshmaydigan eng kichik uch xonali tub sonni toping. Bu songa 222 qo‘shilganda hosil bo‘lgan son ham tub son bo‘lsin.",
    options: ["101", "107", "127", "131"],
    points: 30,
  },

  {
    id: 2,
    question:
      "Anvar 4 minutda 1 km masofa uzoqlikda joylashgan manzilga borishi kerak. U birinchi minutda 18 km/h tezlik bilan harakatlandi. Anvar manzilga vaqtida yetib kelishi uchun qolgan 3 minutda qanday o‘zgarmas tezlik bilan harakatlanishi kerak?",
    options: ["11", "12", "13", "14"],
    points: 30,
  },

  {
    id: 3,
    question:
      "9! sonining oxirgi raqami 1 bo‘lgan natural bo‘luvchilari yig‘indisini toping.",
    options: ["22", "103", "144", "73"],
    points: 30,
  },

  {
    id: 4,
    question:
      "{1, 2, …, 10} to‘plamning nechta bo‘sh bo‘lmagan S qism to‘plami uchun S ning elementlari ko‘paytmasi 0 raqami bilan tugaydi?",
    options: ["736", "752", "768", "800"],
    points: 30,
  },

  {
    id: 5,
    question:
      "T, S, P, M, O nuqtalar aylanada soat strelkasi bo‘yicha aynan shu tartibda joylashgan. TS ∥ PO, TP ∥ MO, TS va PM kesmalari N nuqtada kesishadi. PN = 8, PM = 12, MO = 30 bo‘lsa, TP kesmaning uzunligini toping.",
    options: ["15", "18", "20", "28"],
    points: 30,
  },

  {
    id: 6,
    question:
      "Aynan 15 ta natural bo‘luvchiga ega bo‘lgan 500 dan kichik natural sonlar sonini toping.",
    options: ["1", "2", "3", "4"],
    points: 30,
  },

  {
    id: 7,
    question:
      "Birinchi idishda 30 litr, ikkinchi idishda 40 litr sut bor. Ikkinchi idishdan birinchi idishdagiga qaraganda 2 marta ko‘p sut olingach, birinchisida ikkinchisiga qaraganda 5 litr ko‘p sut qoldi. Birinchi idishdan necha litr sut olingan?",
    options: ["15", "10", "20", "5"],
    points: 30,
  },

  {
    id: 8,
    question:
      "ABC uchburchakning AB va AC tomonlarining o‘rta perpendikulyarlari O nuqtada kesishadi. Agar ∠OCA = 42° va ∠OBA = 35° bo‘lsa, ∠BOC burchak necha gradusga teng?",
    options: ["120°", "145°", "154°", "167°"],
    points: 30,
  },

  {
    id: 9,
    question:
      "Ikki qishloq orasidagi masofa 9 km. Yo‘l qiyalik va tekislikdan iborat. Piyoda qiyalikdan tepaga 4 km/soat tezlik bilan ko‘tarildi, tekis yo‘lda 5 km/soat tezlik bilan yurdi, qiyalikdan pastga esa 6 km/soat tezlik bilan tushdi. Piyoda bir qishloqdan ikkinchisiga borish va kelishga 3 soat 41 minut sarflagan bo‘lsa, yo‘lning tekis qismi necha kilometrni tashkil qiladi?",
    options: ["3", "4", "5", "6"],
    points: 30,
  },

  {
    id: 10,
    question:
      "NEWYEAR so‘zidagi harflardan foydalanib, har bir harfni mavjud miqdoridan ortiq ishlatmasdan, nechta 7 harfli so‘z tuzish mumkin?",
    options: ["1260", "2520", "5040", "720"],
    points: 30,
  },

  {
    id: 11,
    question:
      "11-A sinf o‘quvchilari o‘rtasida o‘tkazilgan so‘rovnoma natijalariga ko‘ra, matematikaga qiziqqan o‘quvchilarning 20 foizi fizika faniga ham qiziqadi. Bundan tashqari, fizika faniga qiziqadigan o‘quvchilarning 25 foizi matematikaga ham qiziqadi. Faqatgina Ali bilan Vali ushbu fanlarga qiziqmas ekan. 11-A sinfdagi o‘quvchilar soni 20 dan ko‘p, ammo 30 dan kam bo‘lsa, shu sinfda nechta o‘quvchi o‘qiydi?",
    options: ["21", "23", "26", "28"],
    points: 30,
  },

  {
    id: 12,
    question:
      "Futbol turnirida n ta jamoa har biri boshqasi bilan bir martadan o‘ynadi. Turnir oxirida har bir jamoaning g‘alabalari soni uning duranglari soniga teng bo‘lgani ma’lum bo‘ldi. Quyidagi javoblardan qaysi biri n sonining qabul qilishi mumkin bo‘lgan qiymati bo‘la olmaydi?",
    options: ["10", "12", "13", "14"],
    points: 30,
  },

  {
    id: 13,
    question:
      "Ikkita paroxod daryo qirg‘og‘ining qarama-qarshi tomonlaridan bir vaqtda yo‘lga chiqadi va o‘zgarmas tezlik bilan qirg‘oqqa perpendikulyar harakatlanadi. Paroxodlar bir-biri bilan eng yaqin qirg‘oqdan 720 metr masofada uchrashadi. Qirg‘oqqa kelgach, ular shu vaqtda orqaga yo‘lga chiqadi va boshqa qirg‘oqqa 400 metr masofada uchrashadi. Daryoning kengligi necha metrga teng?",
    options: ["1020", "1760", "1520", "1840"],
    points: 30,
  },

  {
    id: 14,
    question:
      "202⁶ sonining natural bo‘luvchilaridan nechtasi to‘la kvadrat yoki to‘la kub?",
    options: ["25", "21", "16", "29"],
    points: 30,
  },

  {
    id: 15,
    question:
      "S = 9 + 99 + 999 + … + 99…9 yig‘indisidagi oxirgi qo‘shiluvchida 2026 ta 9 raqami bor bo‘lsa, S ning raqamlari yig‘indisini toping.",
    options: ["2033", "2034", "2042", "2043"],
    points: 30,
  },

  {
    id: 16,
    question:
      "n natural son (n + 1)! + (n + 2)! = 440n! tenglikni qanoatlantiradi. n ning raqamlari yig‘indisini toping.",
    options: ["2", "5", "10", "12"],
    points: 30,
  },

  {
    id: 17,
    question:
      "Katetlari 3 va 4 ga teng bo‘lgan to‘g‘ri burchakli uchburchakka markazi katta katetda yotgan yarim aylana quyidagicha ichki chizilgan. Yarim aylana radiusini toping.",
    options: ["√2 / 3", "3 / 2", "4√2 / 3", "2"],
    points: 30,
    image: "/olympiad/question17.png",
  },

  {
    id: 18,
    question:
      "a ning qanday qiymatida quyidagi tenglama yechimga ega emas?\n\na x + 5 = a − 2x",
    options: ["−2", "0", "1", "2"],
    points: 30,
  },

  {
    id: 19,
    question:
      "Quyidagi ifoda butun son bo‘ladigan barcha k butun sonlar yig‘indisini toping.",
    options: ["−8", "−10", "0", "26"],
    points: 30,
  },

  {
    id: 20,
    question:
      "Tekislikda 5 ta nuqta berilgan va ularning hech qaysi uchtasi bir to‘g‘ri chiziqda yotmaydi. Kamida uchta nuqtadan o‘tuvchi aylanalarning sonini n deb belgilaymiz. n sonining barcha qabul qilishi mumkin bo‘lgan qiymatlari yig‘indisini toping.",
    options: ["12", "15", "18", "20"],
    points: 30,
  },
];

/* =========================================================
   INDEPENDENCE CYCLE
   31 AUGUST 2026 → 13 SEPTEMBER 2026

   BU QISM O'ZGARTIRILMADI
========================================================= */

const independenceQuestions: Question[] = [
  {
    id: 1,
    question:
      "7²⁰¹⁸ sonining o'nlar xonasidagi raqamini toping?",
    options: ["0", "3", "4", "1"],
    points: 30,
  },

  {
    id: 2,
    question:
      "702, 787 va 855 sonlarini m ga bo'linganda bir xil r qoldiq qoladi. 412, 722 va 815 sonlarini n ga bo'lganda bir xil s (s ≠ r) qoldiq qoladi. m + n + r + s ni toping?",
    options: ["63", "65", "62", "61"],
    points: 30,
  },

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

  {
    id: 4,
    question:
      "2²⁹ sonining o'nli yozuvida barcha 10 ta raqamdan faqat bittasi ishtirok etmaydi. Ushbu ishtirok etmagan raqamni toping?",
    options: ["5", "3", "4", "7"],
    points: 30,
  },

  {
    id: 5,
    question:
      "y/(x−z) = (x+y)/z = x/y bo'lsa, x/y ni toping.",
    options: ["3", "1/2", "2/3", "2"],
    points: 30,
  },

  {
    id: 6,
    question:
      "Agar to'rtburchakning ketma-ket tomonlari 70, 90, 130, 110 ga teng bo'lib, bu to'rtburchakka tashqi va ichki aylana chizish mumkin bo'lsa. Ichki chizilgan aylana uzunligi 130 ga teng tomonga uringan nuqtada uni x va y uzunlikdagi kesmalarga bo'ladi. |x − y| ni toping?",
    options: ["13", "12", "14", "15"],
    points: 30,
  },

  {
    id: 7,
    question:
      "Ikkita basseyn bo'sh bo'lgan holatida, 7 ta teng quvvatli quvur birinchi basseynga ulandi. Birinchi basseyn 1/4 qismi to'lgach, 3 ta quvur olinib ikkinchi basseynni to'ldirishga ulandi. Birinchi basseyn 1/2 qismi to'lgach yana ikkita quvur olinib ikkinchi basseynni to'ldirishga ulandi. Bu ishlardan keyin ikki basseyn ham bir vaqtda to'ldi. Birinchi basseyn va ikkinchi basseyn sig'imlari nisbatini toping?",
    options: ["16/23", "7/16", "7/23", "9/16"],
    points: 30,
  },

  {
    id: 8,
    question:
      "Quyidagi sonlardan eng kattasini toping?",
    options: ["30³⁰", "50¹⁰", "40²⁰", "45¹⁵"],
    points: 30,
  },

  {
    id: 9,
    question:
      "Ushbu ikki tenglama umumiy ildizga ega bo'ladigan k ning mumkin bo'lgan qiymatlari yig'indisini toping:\n\nx² − 3x + 2 = 0\n\nva\n\nx² − 5x + k = 0",
    options: ["6", "8", "10", "12"],
    points: 30,
  },

  {
    id: 10,
    question:
      "Agar (x + 2)(x + b) = x² + cx + 6 tenglik o'rinli bo'lsa, c ning qiymatini toping?",
    options: ["−5", "−3", "3", "5"],
    points: 30,
  },

  {
    id: 11,
    question:
      "To'g'ri burchakli ABC da, AC = 12, BC = 5, C to'g'ri burchak. Yarim doira chizmadagidek chizilgan, ushbu yarim doira radiusini toping?",
    options: ["7/6", "13/5", "59/18", "10/3"],
    points: 30,
  },

  {
    id: 12,
    question:
      "Quyidagi tenglamaning ildizlari yig'indisini toping:\n\n⁴√x = 12 / (7 − ⁴√x)",
    options: ["307", "337", "377", "317"],
    points: 30,
  },

  {
    id: 13,
    question:
      "Hisoblang:\n\n√(31 · 30 · 29 · 28 + 1)",
    options: ["869", "879", "859", "849"],
    points: 30,
  },

  {
    id: 14,
    question:
      "Hisoblang:\n\nlog₃7 · log₅9 · log₇11 · log₉13 · ... · log₂₃27",
    options: ["3", "10", "6", "9"],
    points: 30,
  },

  {
    id: 15,
    question:
      "Hisoblang:\n\n20 + 20 1/5 + 20 2/5 + ... + 40",
    options: ["3000", "3030", "3150", "4100"],
    points: 30,
  },

  {
    id: 16,
    question:
      "Hisoblang:\n\n1/2 + 4/2² + 9/2³ + 16/2⁴ + ...",
    options: ["4", "2", "1", "6"],
    points: 30,
  },

  {
    id: 17,
    question:
      "a, b, c haqiqiy sonlar uchun:\n\nac/(a+b) + ba/(b+c) + cb/(c+a) = −9\n\nva\n\nbc/(a+b) + ca/(b+c) + ab/(c+a) = 10\n\nbo'lsa,\n\nb/(a+b) + c/(b+c) + a/(c+a)\n\nning qiymatini toping?",
    options: ["13", "17", "11", "19"],
    points: 30,
  },

  {
    id: 18,
    question:
      "Agar x, y va z lar 1 dan katta va bu yerda w musbat son uchun logₓw = 24, logᵧw = 40 va logₓᵧ𝓏w = 12 bo'lsa, log𝓏w ning qiymatini toping?",
    options: ["50", "25", "40", "60"],
    points: 30,
  },

  {
    id: 19,
    question:
      "Hisoblang:\n\n(3! + 4!)/(2(1! + 2!)) + (4! + 5!)/(3(2! + 3!)) + ... + (12! + 13!)/(11(10! + 11!))",
    options: ["90", "95", "100", "105"],
    points: 30,
  },

  {
    id: 20,
    question:
      "Quyidagi tenglamaning ildizlari ko'paytmasini toping:\n\nx² + 18x + 30 = 2√(x² + 18x + 45)",
    options: ["18", "15", "20", "24"],
    points: 30,
  },
];

/* =========================================================
   UZBEKISTAN DATE
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
          title: "Genesis Olympiad",
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
          title: "Independence Olympiad",
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
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Olympiad Questions API Error:", error);

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