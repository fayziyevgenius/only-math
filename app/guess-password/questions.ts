/*
=========================================================
  GUESS PASSWORD — PUBLIC DATA ONLY
=========================================================

  MUHIM:
  Bu faylda haqiqiy password saqlanmaydi.

  Haqiqiy password:
  .env.local ichida saqlanadi.
=========================================================
*/

export const GUESS_LENGTH = 4;
export const FULL_PASSWORD_LENGTH = 8;

export type Secret = {
  id: number;
  title: string;
  description: string;
  clue: string;
  successMessage: string;
};

/*
=========================================================
  FIRST 4 — GUESS
=========================================================
*/

export const secrets: Secret[] = [
  {
    id: 1,
    title: "Birinchi belgi",
    description:
      "Birinchi belgini topishga harakat qiling.",
    clue:
      "Saytni diqqat bilan kuzating. Birinchi belgi yashirin joylardan birida.",
    successMessage:
      "Birinchi belgi topildi!",
  },

  {
    id: 2,
    title: "Ikkinchi belgi",
    description:
      "Ikkinchi belgini topishga harakat qiling.",
    clue:
      "Matematik elementlar va sayt detallariga e'tibor bering.",
    successMessage:
      "Ikkinchi belgi topildi!",
  },

  {
    id: 3,
    title: "Uchinchi belgi",
    description:
      "Uchinchi belgini topishga harakat qiling.",
    clue:
      "Oddiy ko'ringan joylarni ham tekshirib chiqing.",
    successMessage:
      "Uchinchi belgi topildi!",
  },

  {
    id: 4,
    title: "To'rtinchi belgi",
    description:
      "To'rtinchi belgini topishga harakat qiling.",
    clue:
      "Saytdagi kichik detallarga diqqat bilan qarang.",
    successMessage:
      "To'rtinchi belgi topildi!",
  },
];

/*
=========================================================
  LAST 4 — WHERE TO FIND THEM
=========================================================
*/

export type PasswordSource = {
  position: number;
  title: string;
  description: string;
  route: string;
  icon: string;
};

export const passwordSources: PasswordSource[] = [
  {
    position: 5,
    title: "Math Sprint",
    description:
      "5-belgini Math Sprint bo'limidan toping.",
    route: "/math-sprint",
    icon: "⚡",
  },

  {
    position: 6,
    title: "SAT",
    description:
      "6-belgini SAT bo'limidan toping.",
    route: "/sat",
    icon: "📘",
  },

  {
    position: 7,
    title: "Olympiad",
    description:
      "7-belgini Olympiad bo'limidan toping.",
    route: "/olympiad",
    icon: "🏆",
  },

  {
    position: 8,
    title: "Certificate",
    description:
      "8-belgini Certificate bo'limidan toping.",
    route: "/certificate",
    icon: "📚",
  },
];