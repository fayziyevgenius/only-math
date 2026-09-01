import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   TYPES
========================================================= */

type Question = {
  id: number;
  type?: "math" | "geometry";
  question: string;
  expression?: string;
  options: string[];
  points: number;
  correctAnswer: number;
  image?: string;
};

/* =========================================================
   GENESIS
========================================================= */

const genesisQuestions: Question[] = [
  {
    id: 1,
    type: "geometry",
    question:
      "Rasmda AB || ED bo'lsa, x burchak qiymatini toping.",
    options: [
      "\\(50^\\circ\\)",
      "\\(30^\\circ\\)",
      "\\(35^\\circ\\)",
      "\\(20^\\circ\\)",
    ],
    points: 0,
    correctAnswer: 0,
    image: "/certificate/q1.png",
  },

  {
    id: 2,
    type: "math",
    question:
      "Tengsizlikning natural yechimlari nechta?",
    expression:
      "\\frac{25-4x}{\\sqrt[3]{10}-2} \\geq 0",
    options: ["10", "4", "8", "6"],
    points: 0,
    correctAnswer: 3,
  },

  {
    id: 3,
    type: "math",
    question:
      "Tengsizlikni qanoatlantiradigan butun sonlar nechta?",
    expression:
      "x^2-6|x|+5\\leq0",
    options: ["8", "9", "10", "11"],
    points: 0,
    correctAnswer: 2,
  },

  {
    id: 4,
    type: "math",
    question:
      "Agar \\(2^a=5\\), \\(2^b=3\\) bo'lsa, \\(c\\) ni \\(a\\) va \\(b\\) orqali ifodalang.",
    expression:
      "\\left(\\frac{25}{3}\\right)^c=405",
    options: [
      "\\(\\frac{b+4a}{2a-b}\\)",
      "\\(\\frac{4b+a}{2a+b}\\)",
      "\\(\\frac{4b+a}{2a-b}\\)",
      "\\(\\frac{4b-a}{2a-b}\\)",
    ],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 5,
    type: "math",
    question:
      "Ketma-ketlikning barcha hadlari yig'indisini toping.",
    expression:
      "b_n=\\frac{2^n}{3^{n-1}}",
    options: ["6", "1", "2", "3"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 6,
    type: "math",
    question: "Hisoblang:",
    expression:
      "\\sqrt{\\sqrt{47}-\\sqrt{31}}\\cdot\\sqrt{\\sqrt{47}+\\sqrt{31}}",
    options: ["7", "5", "6", "4"],
    points: 0,
    correctAnswer: 3,
  },

  {
    id: 7,
    type: "geometry",
    question:
      "ABC uchburchakda AD, BN, CM medianalar kesishgan nuqta G nuqta bo'lsin. Agar ABC uchburchak yuzasi 48 ga teng bo'lsa, GDN uchburchak yuzasini toping.",
    options: ["5", "4", "3", "12"],
    points: 0,
    correctAnswer: 3,
    image: "/certificate/q7.png",
  },

  {
    id: 8,
    type: "geometry",
    question:
      "Aylanada A, B, C, D nuqtalar olingan. O — aylana markazi, A va D nuqtalar bir to'g'ri chiziqda yotadi. Agar \\(\\angle ABC=30^\\circ\\) va \\(OD=3\\) bo'lsa, CD ni toping.",
    options: [
      "3",
      "4",
      "\\(\\sqrt{3}\\)",
      "\\(3\\sqrt{3}\\)",
    ],
    points: 0,
    correctAnswer: 3,
    image: "/certificate/q8.png",
  },

  {
    id: 9,
    type: "math",
    question:
      "Agar aholining elektr energiyasiga talabi har yili 2,5% ortsa, necha yilda 9 marta ortadi?",
    options: [
      "\\(\\log_9 1,025\\)",
      "\\(\\log_9 0,025\\)",
      "\\(\\log_{1,025}9\\)",
      "\\(\\log_{0,025}9\\)",
    ],
    points: 0,
    correctAnswer: 2,
  },

  {
    id: 10,
    type: "math",
    question:
      "Tengsizlikning \\([2;2023]\\) oralig'ida nechta natural yechimi bor?",
    expression:
      "2^x+3^x+4^x+5^x>54",
    options: ["2021", "2023", "0", "2022"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 11,
    type: "math",
    question: "Tenglamani yeching.",
    expression:
      "x+\\frac{x}{1+2}+\\frac{x}{1+2+3}+\\cdots+\\frac{x}{1+2+3+\\cdots+7}=7",
    options: ["5", "4", "3", "2"],
    points: 0,
    correctAnswer: 1,
  },

  {
    id: 12,
    type: "geometry",
    question:
      "ABC to'g'ri burchakli uchburchakning C to'g'ri burchak uchidan AB gipotenuzaga parallel tekislik o'tkazilgan. Tekislikdan gipotenuzagacha bo'lgan eng qisqa masofa 12 ga teng. Katetlarning tekislikdagi proyeksiyalari 16 va 9 ga teng bo'lsa, AB gipotenuza uzunligini toping.",
    options: ["25", "30", "24", "32"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 13,
    type: "math",
    question:
      "A = {a, b, c, d, m, n} va B = {a, b, c, k, l, m} to'plamlar berilgan. A ∩ B to'plamning bo'sh bo'lmagan qism to'plamlari soni nechta?",
    options: ["10", "8", "15", "16"],
    points: 0,
    correctAnswer: 2,
  },

  {
    id: 14,
    type: "math",
    question:
      "30 bilan 86 sonlar orasiga 7 ta son shunday joylashtirildiki, ular berilgan sonlar bilan birga arifmetik progressiyani tashkil qiladi. Qo'yilgan sonlar yig'indisini toping.",
    options: ["204", "302", "406", "248"],
    points: 0,
    correctAnswer: 2,
  },

  {
    id: 15,
    type: "geometry",
    question:
      "Radiusi 4 ga teng aylanaga muntazam o'nikkiburchak ichki chizilgan. O'nikkiburchakning yuzini toping.",
    options: ["24", "48", "64", "80"],
    points: 0,
    correctAnswer: 1,
  },

  {
    id: 16,
    type: "math",
    question:
      "Raqamlari 6 dan kichik bo'lmagan uch xonali 3 ga bo'linadigan natural sonlar nechta?",
    options: ["18", "20", "22", "12"],
    points: 0,
    correctAnswer: 1,
  },

  {
    id: 17,
    type: "math",
    question:
      "A shahardan B shaharga 1-avtomobil o'zgarmas 120 km/h tezlik bilan, 10 daqiqadan so'ng 2-avtomobil 150 km/h tezlik bilan yo'lga chiqdi. Ular B shaharga bir vaqtda yetib keldi. A va B shaharlar orasidagi masofani toping.",
    options: ["100", "120", "50", "60"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 18,
    type: "math",
    question:
      "To'g'ri to'rtburchakning eni 25% ga, bo'yi 20% ga ortgan bo'lsa, yuzi necha foizga ortgan?",
    options: ["45%", "50%", "60%", "5%"],
    points: 0,
    correctAnswer: 1,
  },

  {
    id: 19,
    type: "math",
    question:
      "Bir oilaning oylik maoshi 15 000 000 so'm. Uning 60% i oilaviy xarajatlarga sarflanar edi. Qolgan pulning 30% ni bankka omonatga qo'yadi. Oila bankka necha so'm pul qo'ygan?",
    options: [
      "1 800 000",
      "2 000 000",
      "2 500 000",
      "2 200 000",
    ],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 20,
    type: "math",
    question:
      "Arifmetik progressiyada \\(a_1+a_3+a_5+\\cdots+a_{2n-1}=96\\), \\(a_{n-2}+a_{n+2}=12\\) bo'lsa, n ning qiymatini toping.",
    options: ["8", "32", "24", "16"],
    points: 0,
    correctAnswer: 3,
  },
];

/* =========================================================
   INDEPENDENCE
========================================================= */

const independenceQuestions: Question[] = [
  {
    id: 1,
    type: "math",
    question:
      "\\(8962ab\\) ko'rinishdagi son \\(12\\) ga qoldiqsiz bo'linsa, \\(a\\cdot b\\) ning eng katta qiymatini toping.",
    options: ["72", "48", "64", "54"],
    points: 0,
    correctAnswer: 1,
  },

  {
    id: 2,
    type: "math",
    question:
      "Birinchi sonning \\(10\\%\\) iga ikkinchi sonning \\(1/6\\) qismi qo'shilgani, birinchi sonning yarmidan ikkinchi sonning yarmini ayirganimizga teng. Birinchi sonning ikkinchi songa nisbatini toping.",
    options: ["3/5", "5/3", "5/6", "6/5"],
    points: 0,
    correctAnswer: 1,
  },

  {
    id: 3,
    type: "math",
    question:
      "O'quvchi ikkita kitobni 205000 so'mga sotib oldi. Agar birinchi kitob narxi \\(15\\%\\) ga kamaytirilsa va ikkinchi kitob narxi \\(20\\%\\) ga oshirilsa, u holda kitoblarning yangi narxlari o'zaro teng bo'ladi. Birinchi kitobning narxi ikkinchi kitob narxidan necha so'mga qimmat?",
    options: ["30000", "35000", "45000", "40000"],
    points: 0,
    correctAnswer: 1,
  },

  {
    id: 4,
    type: "math",
    question:
      "Birinchi nasos 10 litr hajmdagi suvni haydash uchun 5 minut vaqt sarflaydi. Ikkinchi nasos esa xuddi shuncha miqdordagi suvni 7 minut davomida hayday oladi. Agar ikkala nasos bir vaqtning o'zida ishlasa, jami 24 litr suvni haydab bo'lish uchun qancha vaqt kerak?",
    options: ["7", "8", "9", "10"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 5,
    type: "math",
    question:
      "Jasur ko'ylak, kostyum va dastro'mol sotib oldi. Agar kostyum 3 baravar qimmatroq bo'lganida, xaridning umumiy narxi 130% ga oshgan bo'lardi. Agar dastro'mol 2 baravar arzonroq bo'lganida, umumiy narx 4% ga kamaygan bo'lardi. Ko'ylak narxi umumiy xarid narxining necha foizini tashkil etadi?",
    options: ["27", "18", "24", "28"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 6,
    type: "math",
    question:
      "\\(8,a_2,a_3,...,a_n\\) arifmetik progressiyaning dastlabki to'rtta hadi yig'indisi 50 ga, oxirgi to'rtta hadi yig'indisi 170 ga teng. O'rtadagi ikkita had ko'paytmasi nimaga teng?",
    options: ["642", "754", "728", "814"],
    points: 0,
    correctAnswer: 1,
  },

  {
    id: 7,
    type: "geometry",
    question:
      "\\(ABCD\\) to'g'ri to'rtburchakning \\(AB\\) katta tomon uzunligi 13 cm. B burchak bissektrisasi va AD to'g'ri chiziq E nuqtada kesishadi. BE bissektrisa CD ni F nuqtada kesadi. Agar DE = 5 cm bo'lsa, BCF uchburchak yuzasini toping.",
    options: ["32", "64", "84", "42"],
    points: 0,
    correctAnswer: 3,
  },

  {
    id: 8,
    type: "math",
    question:
      "\\(n=19\\) ta hadli arifmetik progressiyaning n ta hadi o'rta arifmetigi \\(2n\\) ga teng bo'lsa, arifmetik progressiyaning o'ninchi hadini toping.",
    options: ["38", "20", "40", "36"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 9,
    type: "math",
    question:
      "Geometrik progressiyada \\(b_1+b_2+b_3=70\\) va \\(b_1b_2b_3=8000\\) bo'lsa, dastlabki beshta hadi yig'indisini toping.",
    options: [
      "310 yoki 77.5",
      "310 yoki 77.75",
      "330 yoki 77.25",
      "330 yoki 77.5",
    ],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 10,
    type: "math",
    question:
      "Qavariq \\(n\\) burchakning diagonallari soni 25 dan kichik emas va 30 dan katta emas. \\(n\\) ning qiymatini toping.",
    options: ["9", "6", "11", "7"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 11,
    type: "math",
    question:
      "1000 gacha bo'lgan natural sonlar ichida 11 ga qoldiqsiz bo'linadigan va 2 ga ham 3 ga ham qoldiqsiz bo'linmaydigan sonlar nechta?",
    options: ["90", "75", "45", "30"],
    points: 0,
    correctAnswer: 3,
  },

  {
    id: 12,
    type: "geometry",
    question:
      "Teng yonli trapetsiyaning katta asosi 25 sm va perimetri 55 sm. Agar trapetsiyaning diagonali uning o'tkir burchagini teng ikkiga bo'lsa, trapetsiyaning o'rta chizig'ini toping.",
    options: ["16", "18", "17.5", "17"],
    points: 0,
    correctAnswer: 2,
  },

  {
    id: 13,
    type: "math",
    question:
      "Agar to'plamga 1 ta element qo'shilganidagi qism to'plamlari soni to'plamdan 1 ta element chiqarilgandagi qism to'plamlari sonidan 24 taga ko'p bo'lsa, to'plamning qism to'plamlari sonini toping.",
    options: ["32", "8", "4", "16"],
    points: 0,
    correctAnswer: 3,
  },

  {
    id: 14,
    type: "math",
    question:
      "Abrorbekda 3 ta fizika va 2 ta matematika kitoblari bor. Matematika kitoblari yonma-yon bo'lishi sharti bilan 5 ta kitobni javonga necha xil usulda joylashtirish mumkin?",
    options: ["120", "24", "48", "60"],
    points: 0,
    correctAnswer: 2,
  },

  {
    id: 15,
    type: "geometry",
    question:
      "Teng yonli uchburchakning ikki tomoni 2 va 5 ga teng. Uchburchakning eng kichik medianasi uzunligini toping.",
    options: [
      "\\(\\frac{\\sqrt{33}}{2}\\)",
      "\\(\\frac{\\sqrt{31}}{2}\\)",
      "3",
      "\\(\\sqrt{6}\\)",
    ],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 16,
    type: "math",
    question:
      "Hisoblang: \\((-1^2)^3+(-1^3)^4+...+(-1^{99})^{100}\\)",
    options: ["0", "98", "50", "-1"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 17,
    type: "geometry",
    question:
      "Rasmda ABC uchburchak, uning AD va CE bissektrisalari tasvirlangan. Agar \\(\\angle ABC=108^\\circ\\) bo'lsa, \\(\\angle ENA\\) ni toping. Barcha berilganlar chizmada ko'rsatilgan.",
    options: [
      "\\(36^\\circ\\)",
      "\\(54^\\circ\\)",
      "\\(72^\\circ\\)",
      "\\(18^\\circ\\)",
    ],
    points: 0,
    correctAnswer: 0,
    image: "/independence/q17.png",
  },

  {
    id: 18,
    type: "math",
    question:
      "Nechta natural son ushbu tengsizlikning yechimi bo'la olmaydi?",
    expression:
      "x(x-3)^2>0",
    options: ["1 ta", "2 ta", "3 ta", "4 ta"],
    points: 0,
    correctAnswer: 0,
  },

  {
    id: 19,
    type: "math",
    question:
      "Quyidagi tenglama nechta haqiqiy ildizga ega?",
    expression:
      "(x-6)^4+(x-8)^4=16",
    options: ["1 ta", "2 ta", "3 ta", "4 ta"],
    points: 0,
    correctAnswer: 1,
  },

  {
    id: 20,
    type: "math",
    question:
      "Tengsizlikni nechta BUTUN son qanoatlantiradi?",
    expression:
      "\\left(\\frac{1}{2}\\right)^{x^2+3x}-\\frac{2^{-x}}{8}>0",
    options: ["2 ta", "3 ta", "4 ta", "5 ta"],
    points: 0,
    correctAnswer: 1,
  },
];

/* =========================================================
   CYCLES
========================================================= */

const cycles = [
  {
    name: "genesis",
    title: "Genesis",
    start: "2026-08-17",
    end: "2026-08-30",
    questions: genesisQuestions,
  },
  {
    name: "independence",
    title: "Independence",
    start: "2026-08-31",
    end: "2026-09-13",
    questions: independenceQuestions,
  },
];

/* =========================================================
   DATE
========================================================= */

function getToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/* =========================================================
   CURRENT CYCLE
========================================================= */

function getCurrentCycleIndex(today: string) {
  for (let i = 0; i < cycles.length; i++) {
    if (
      today >= cycles[i].start &&
      today <= cycles[i].end
    ) {
      return i;
    }
  }

  /*
    Agar barcha cycle'lar tugagan bo'lsa,
    hammasi archive bo'ladi.
  */

  if (today > cycles[cycles.length - 1].end) {
    return cycles.length;
  }

  return 0;
}

/* =========================================================
   GET
========================================================= */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        {
          error: "Username is required.",
        },
        {
          status: 400,
        }
      );
    }

    const today = getToday();

    const currentIndex =
      getCurrentCycleIndex(today);

    const db = await connectDB();

    const user = await db
      .collection("users")
      .findOne({ username });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
      MUHIM:

      Hozirgi cycle TRAINING'DA YO'Q.

      Masalan:
      Independence davomida:
      → Genesis chiqadi
      → Independence chiqmaydi
    */

    const archivedCycles = cycles
      .slice(0, currentIndex)
      .map((cycle) => ({
        name: cycle.name,
        title: cycle.title,
        start: cycle.start,
        end: cycle.end,

        questions: cycle.questions.map(
          (question) => ({
            id: question.id,
            type: question.type,
            question: question.question,
            expression: question.expression,
            options: question.options,
            image: question.image,

            /*
              TRAINING'DA GP YO'Q
            */
            points: 0,
          })
        ),
      }));

    const attempts =
      user.trainingAttempts || {};

    return NextResponse.json(
      {
        success: true,

        currentCycle:
          currentIndex < cycles.length
            ? cycles[currentIndex].name
            : null,

        cycles: archivedCycles,

        attempts,
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
    console.error(
      "Training GET Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST
   TRAINING ANSWER
========================================================= */

export async function POST(req: Request) {
  try {
    const {
      username,
      cycle,
      questionId,
      answer,
    } = await req.json();

    if (!username) {
      return NextResponse.json(
        {
          error: "Username is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!cycle) {
      return NextResponse.json(
        {
          error: "Cycle is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!questionId) {
      return NextResponse.json(
        {
          error: "Question ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const selectedCycle = cycles.find(
      (item) => item.name === cycle
    );

    if (!selectedCycle) {
      return NextResponse.json(
        {
          error: "Invalid cycle.",
        },
        {
          status: 400,
        }
      );
    }

    const question =
      selectedCycle.questions.find(
        (item) =>
          item.id === Number(questionId)
      );

    if (!question) {
      return NextResponse.json(
        {
          error: "Question not found.",
        },
        {
          status: 404,
        }
      );
    }

    const db = await connectDB();

    const users = db.collection("users");

    const user = await users.findOne({
      username,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const attempts =
      user.trainingAttempts || {};

    const cycleAttempts =
      attempts[cycle] || {};

    /*
      QAYTA ISHLASHGA RUXSAT YO'Q
    */

    if (
      cycleAttempts[
        String(questionId)
      ]
    ) {
      return NextResponse.json(
        {
          error:
            "You have already answered this question.",
        },
        {
          status: 400,
        }
      );
    }

    const isCorrect =
      Number(answer) ===
      question.correctAnswer;

    const result = {
      answer: Number(answer),
      correct: isCorrect,
      completedAt: new Date(),
    };

    await users.updateOne(
      {
        username,
      },
      {
        $set: {
          [`trainingAttempts.${cycle}.${questionId}`]:
            result,

          updatedAt: new Date(),
        },
      }
    );

    /*
      MUHIM:

      $inc YO'Q.

      GP berilmaydi.
      GeniusPoints o'zgarmaydi.
      Perfect Trio o'zgarmaydi.
      Stats o'zgarmaydi.
      Leaderboard o'zgarmaydi.
    */

    return NextResponse.json({
      success: true,

      correct: isCorrect,

      correctAnswer:
        question.correctAnswer,

      selectedAnswer:
        Number(answer),

      gp: 0,
    });
  } catch (error) {
    console.error(
      "Training POST Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}