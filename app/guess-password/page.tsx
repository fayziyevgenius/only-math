"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Lock,
  Unlock,
  Search,
  Sparkles,
  Eye,
  KeyRound,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import {
  secrets,
  passwordSources,
  GUESS_LENGTH,
  FULL_PASSWORD_LENGTH,
} from "./questions";

type GuessHistory = {
  guess: string;
  result: ("correct" | "wrong")[];
};

type CurrentUser = {
  username?: string;
  email?: string;
};

export default function GuessPasswordPage() {
  /*
  =========================================================
    STEP
  =========================================================
  */

  const [step, setStep] = useState<
    "guess" | "password" | "won"
  >("guess");

  /*
  =========================================================
    CURRENT USER
  =========================================================
  */

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [userLoading, setUserLoading] =
    useState(true);

  /*
  =========================================================
    FIRST 4
  =========================================================
  */

  const [guess, setGuess] = useState<string[]>(
    Array(GUESS_LENGTH).fill("")
  );

  const [guesses, setGuesses] =
    useState<GuessHistory[]>([]);

  const [guessLoading, setGuessLoading] =
    useState(false);

  /*
  =========================================================
    FINAL 8
  =========================================================
  */

  const [finalPassword, setFinalPassword] =
    useState<string[]>(
      Array(FULL_PASSWORD_LENGTH).fill("")
    );

  const [finalLoading, setFinalLoading] =
    useState(false);

  /*
  =========================================================
    SESSION TOKEN
  =========================================================
  */

  const [unlockToken, setUnlockToken] =
    useState("");

  /*
  =========================================================
    MESSAGE
  =========================================================
  */

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
  =========================================================
    LOAD USER
  =========================================================
  */

  useEffect(() => {
    async function loadUser() {
      try {
        setUserLoading(true);
        setError("");

        /*
        =====================================================
          LOGIN TIZIMIDAGI ASOSIY KEY
        =====================================================

          DashboardPage ham aynan:
          localStorage.getItem("currentUser")

          dan foydalanadi.
        */

        const currentUserData =
          localStorage.getItem("currentUser");

        if (!currentUserData) {
          console.error(
            "currentUser localStorage'da topilmadi."
          );

          setError(
            "User aniqlanmadi. Iltimos, qayta login qiling."
          );

          return;
        }

        /*
        =====================================================
          PARSE CURRENT USER
        =====================================================
        */

        let parsedUser: {
          username?: string;
          email?: string;
        };

        try {
          parsedUser =
            JSON.parse(currentUserData);
        } catch (parseError) {
          console.error(
            "currentUser JSON parse error:",
            parseError
          );

          setError(
            "Login ma'lumotlari noto'g'ri. Iltimos, qayta login qiling."
          );

          return;
        }

        /*
        =====================================================
          USERNAME / EMAIL
        =====================================================
        */

        const username =
          typeof parsedUser?.username ===
          "string"
            ? parsedUser.username.trim()
            : "";

        const email =
          typeof parsedUser?.email ===
          "string"
            ? parsedUser.email.trim()
            : "";

        if (!username && !email) {
          console.error(
            "currentUser ichida username yoki email topilmadi:",
            parsedUser
          );

          setError(
            "User aniqlanmadi. Iltimos, qayta login qiling."
          );

          return;
        }

        console.log(
          "Guess Password Current User:",
          {
            username,
            email,
          }
        );

        /*
        =====================================================
          /api/me
        =====================================================
        */

        const response =
          await fetch(
            "/api/me",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                username:
                  username ||
                  undefined,

                email:
                  email ||
                  undefined,
              }),

              cache: "no-store",
            }
          );

        const data =
          await response.json();

        /*
        =====================================================
          API ERROR
        =====================================================
        */

        if (!response.ok) {
          console.error(
            "ME API ERROR:",
            data
          );

          setError(
            data.error ||
              "Userni aniqlab bo'lmadi."
          );

          return;
        }

        /*
        =====================================================
          USER SAQLASH
        =====================================================
        */

        setCurrentUser({
          username:
            data.username ||
            username ||
            undefined,

          email:
            data.email ||
            email ||
            undefined,
        });

        setError("");

        console.log(
          "Guess Password User Loaded:",
          {
            username:
              data.username ||
              username,

            email:
              data.email ||
              email,
          }
        );
      } catch (error) {
        console.error(
          "Load user error:",
          error
        );

        setError(
          "User ma'lumotlarini olishda xatolik."
        );
      } finally {
        setUserLoading(false);
      }
    }

    loadUser();
  }, []);

  /*
  =========================================================
    FIRST 4 VALUE
  =========================================================
  */

  const guessValue =
    guess.join("");

  const guessComplete =
    guessValue.length ===
      GUESS_LENGTH &&
    guess.every(Boolean);

  /*
  =========================================================
    FINAL 8 VALUE
  =========================================================
  */

  const finalPasswordValue =
    finalPassword.join("");

  const finalPasswordComplete =
    finalPasswordValue.length ===
      FULL_PASSWORD_LENGTH &&
    finalPassword.every(Boolean);

  /*
  =========================================================
    SECRET REVEAL
  =========================================================
  */

  function revealSecret(id: number) {
    const secret =
      secrets.find(
        (item) =>
          item.id === id
      );

    if (!secret) {
      return;
    }

    setMessage(
      secret.successMessage
    );

    setError("");
  }

  /*
  =========================================================
    FIRST 4 INPUT
  =========================================================
  */

  function handleGuessChange(
    index: number,
    value: string
  ) {
    const character =
      value
        .slice(-1)
        .toUpperCase();

    if (
      character &&
      !/^[A-Z0-9]$/.test(
        character
      )
    ) {
      return;
    }

    const updated = [
      ...guess,
    ];

    updated[index] =
      character;

    setGuess(updated);

    setMessage("");
    setError("");

    if (
      character &&
      index <
        GUESS_LENGTH - 1
    ) {
      document
        .getElementById(
          `guess-${index + 1}`
        )
        ?.focus();
    }
  }

  /*
  =========================================================
    FIRST 4 BACKSPACE
  =========================================================
  */

  function handleGuessKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key ===
        "Backspace" &&
      !guess[index] &&
      index > 0
    ) {
      document
        .getElementById(
          `guess-${index - 1}`
        )
        ?.focus();
    }
  }

  /*
  =========================================================
    SUBMIT FIRST 4
  =========================================================
  */

  async function submitGuess() {
    if (!guessComplete) {
      setError(
        "Avval 4 ta belgini kiriting."
      );

      return;
    }

    setGuessLoading(true);

    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/guess-password",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              guess:
                guessValue,
            }),
          }
        );

      const data =
        await response.json();

      /*
      =====================================================
        WRONG
      =====================================================
      */

      if (!response.ok) {
        setGuesses(
          (current) => [
            {
              guess:
                guessValue,

              result:
                Array(
                  GUESS_LENGTH
                ).fill(
                  "wrong"
                ),
            },

            ...current,
          ]
        );

        setError(
          data.error ||
            "Noto'g'ri taxmin."
        );

        setGuess(
          Array(
            GUESS_LENGTH
          ).fill("")
        );

        setTimeout(() => {
          document
            .getElementById(
              "guess-0"
            )
            ?.focus();
        }, 50);

        return;
      }

      /*
      =====================================================
        CORRECT
      =====================================================
      */

      setGuesses(
        (current) => [
          {
            guess:
              guessValue,

            result:
              Array(
                GUESS_LENGTH
              ).fill(
                "correct"
              ),
          },

          ...current,
        ]
      );

      /*
        Tokenni saqlaymiz.
      */

      setUnlockToken(
        data.token
      );

      /*
        Birinchi 4 ta belgini
        final passwordga joylaymiz.
      */

      setFinalPassword([
        ...guessValue.split(""),

        "",
        "",
        "",
        "",
      ]);

      setStep(
        "password"
      );

      setMessage(
        "🎉 4 ta belgini to'g'ri topdingiz! Endi qolgan 4 ta belgini toping."
      );
    } catch (error) {
      console.error(
        "Guess password error:",
        error
      );

      setError(
        "Server bilan bog'lanishda xatolik."
      );
    } finally {
      setGuessLoading(
        false
      );
    }
  }

  /*
  =========================================================
    FINAL INPUT
  =========================================================
  */

  function handleFinalChange(
    index: number,
    value: string
  ) {
    /*
      Birinchi 4 ta locked.
    */

    if (index < 4) {
      return;
    }

    const character =
      value
        .slice(-1)
        .toUpperCase();

    if (
      character &&
      !/^[A-Z0-9]$/.test(
        character
      )
    ) {
      return;
    }

    const updated = [
      ...finalPassword,
    ];

    updated[index] =
      character;

    setFinalPassword(
      updated
    );

    setMessage("");
    setError("");

    if (
      character &&
      index <
        FULL_PASSWORD_LENGTH -
          1
    ) {
      document
        .getElementById(
          `final-${index + 1}`
        )
        ?.focus();
    }
  }

  /*
  =========================================================
    FINAL BACKSPACE
  =========================================================
  */

  function handleFinalKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (index < 4) {
      return;
    }

    if (
      event.key ===
        "Backspace" &&
      !finalPassword[index] &&
      index > 4
    ) {
      document
        .getElementById(
          `final-${index - 1}`
        )
        ?.focus();
    }
  }

  /*
  =========================================================
    SUBMIT FINAL PASSWORD
  =========================================================
  */

  async function submitFinalPassword() {
    if (!finalPasswordComplete) {
      setError(
        "Avval 8 ta belgini to'liq kiriting."
      );

      return;
    }

    if (!unlockToken) {
      setError(
        "Avval 4 belgili kodni to'g'ri toping."
      );

      return;
    }

    if (!currentUser) {
      setError(
        "User aniqlanmadi. Iltimos, sahifani yangilang."
      );

      return;
    }

    setFinalLoading(true);

    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/guess-password/final",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              password:
                finalPasswordValue,

              token:
                unlockToken,

              username:
                currentUser.username,

              email:
                currentUser.email,
            }),
          }
        );

      const data =
        await response.json();

      /*
      =====================================================
        ERROR
      =====================================================
      */

      if (!response.ok) {
        setError(
          data.error ||
            "Password noto'g'ri."
        );

        /*
          Faqat oxirgi 4 ni tozalaymiz.
        */

        setFinalPassword([
          finalPassword[0],
          finalPassword[1],
          finalPassword[2],
          finalPassword[3],

          "",
          "",
          "",
          "",
        ]);

        setTimeout(() => {
          document
            .getElementById(
              "final-4"
            )
            ?.focus();
        }, 50);

        return;
      }

      /*
      =====================================================
        SUCCESS
      =====================================================
      */

      setStep("won");

      if (
        data.alreadyClaimed
      ) {
        setMessage(
          `🎉 Password ochildi! 700 GP rewardni avval olgansiz. Hozirgi GP: ${data.geniusPoints}`
        );
      } else {
        setMessage(
          `🎉 Tabriklaymiz! Password buzildi! +700 GP. Jami GP: ${data.geniusPoints}`
        );
      }
    } catch (error) {
      console.error(
        "Final password error:",
        error
      );

      setError(
        "Server bilan bog'lanishda xatolik."
      );
    } finally {
      setFinalLoading(
        false
      );
    }
  }

  /*
  =========================================================
    RESET
  =========================================================
  */

  function resetGame() {
    setStep("guess");

    setGuess(
      Array(
        GUESS_LENGTH
      ).fill("")
    );

    setFinalPassword(
      Array(
        FULL_PASSWORD_LENGTH
      ).fill("")
    );

    setGuesses([]);

    setUnlockToken("");

    setMessage("");

    setError("");

    setTimeout(() => {
      document
        .getElementById(
          "guess-0"
        )
        ?.focus();
    }, 50);
  }

  /*
  =========================================================
    LOADING USER
  =========================================================
  */

  if (userLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl border border-green-500/30 bg-green-500/10 flex items-center justify-center">
            <KeyRound
              size={22}
              className="text-green-400 animate-pulse"
            />
          </div>

          <p className="text-zinc-400 font-bold">
            User aniqlanmoqda...
          </p>
        </div>
      </main>
    );
  }

  /*
  =========================================================
    RENDER
  =========================================================
  */

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-hidden">

      {/* BACKGROUND */}

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green-500/10 blur-[130px]" />

        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-14">

        {/* HEADER */}

        <section className="text-center mb-12">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-black uppercase tracking-[0.2em] mb-5">
            <Sparkles size={14} />

            Faqat eng zukkolargina uddalaydi
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
            <span className="text-white">
              KODNI{" "}
            </span>

            <span className="text-green-400">
              BUZA OLASIZMI?
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-zinc-400 text-base md:text-lg leading-relaxed">
            8 ta belgi. 8 ta sir.
            <br />
            Avval 4 ta belgini guess qiling.
            Keyin qolgan 4 ta belgini sayt
            bo'limlaridan toping.
          </p>

        </section>

        {/* STEP INDICATOR */}

        <section className="max-w-3xl mx-auto mb-8">

          <div className="grid grid-cols-2 gap-3">

            <div
              className={`
                rounded-2xl border p-4
                ${
                  step === "guess"
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-zinc-800 bg-zinc-900/60"
                }
              `}
            >
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                1-BOSQICH
              </p>

              <p className="font-black mt-1">
                4 ta belgini guess qilish
              </p>
            </div>

            <div
              className={`
                rounded-2xl border p-4
                ${
                  step ===
                    "password" ||
                  step === "won"
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-zinc-800 bg-zinc-900/60"
                }
              `}
            >
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                2-BOSQICH
              </p>

              <p className="font-black mt-1">
                8 ta passwordni to'ldirish
              </p>
            </div>

          </div>

        </section>

        {/* FIRST 4 */}

        {step === "guess" && (
          <>
            <section className="max-w-3xl mx-auto mb-10 rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-6 md:p-8">

              <div className="text-center mb-8">

                <div className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center bg-zinc-950 border border-zinc-800">
                  <KeyRound
                    size={30}
                    className="text-green-400"
                  />
                </div>

                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">
                  1-BOSQICH
                </p>

                <h2 className="text-2xl md:text-3xl font-black">
                  4 ta belgini guess qiling
                </h2>

                <p className="text-zinc-500 text-sm mt-2">
                  4 belgili kodni topishga
                  harakat qiling.
                </p>

              </div>

              {/* INPUTS */}

              <div className="flex justify-center gap-3 md:gap-5 mb-7">

                {guess.map(
                  (
                    character,
                    index
                  ) => (
                    <input
                      key={index}
                      id={`guess-${index}`}
                      value={
                        character
                      }
                      onChange={(
                        event
                      ) =>
                        handleGuessChange(
                          index,
                          event.target.value
                        )
                      }
                      onKeyDown={(
                        event
                      ) =>
                        handleGuessKeyDown(
                          index,
                          event
                        )
                      }
                      maxLength={1}
                      autoComplete="off"
                      className="
                        w-14 h-16
                        md:w-20 md:h-20
                        rounded-2xl
                        bg-zinc-950
                        border border-zinc-700
                        text-center
                        text-2xl md:text-3xl
                        font-black
                        text-white
                        outline-none
                        focus:border-green-500
                        focus:ring-2
                        focus:ring-green-500/20
                        transition
                        uppercase
                      "
                      aria-label={`Guess ${
                        index + 1
                      }`}
                    />
                  )
                )}

              </div>

              {error && (
                <div className="max-w-md mx-auto mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                  {error}
                </div>
              )}

              {message && (
                <div className="max-w-md mx-auto mb-5 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-400">
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={
                  submitGuess
                }
                disabled={
                  !guessComplete ||
                  guessLoading
                }
                className="
                  w-full max-w-md mx-auto
                  flex items-center justify-center
                  gap-2 px-6 py-4
                  rounded-2xl
                  bg-green-600
                  hover:bg-green-500
                  disabled:bg-zinc-800
                  disabled:text-zinc-600
                  disabled:cursor-not-allowed
                  text-white font-black
                  transition
                "
              >
                <KeyRound size={19} />

                {guessLoading
                  ? "TEKSHIRILMOQDA..."
                  : "GUESS QILISH"}
              </button>

            </section>

            {/* HISTORY */}

            {guesses.length >
              0 && (
              <section className="max-w-3xl mx-auto mb-10">

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-600 font-bold">
                      Urinishlar
                    </p>

                    <h2 className="text-xl font-black">
                      Sizning taxminlaringiz
                    </h2>
                  </div>

                  <span className="text-sm text-zinc-600">
                    {
                      guesses.length
                    }{" "}
                    ta urinish
                  </span>

                </div>

                <div className="space-y-3">

                  {guesses.map(
                    (
                      item,
                      guessIndex
                    ) => (
                      <div
                        key={
                          guessIndex
                        }
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
                      >
                        <div className="flex gap-2">

                          {item.guess
                            .split(
                              ""
                            )
                            .map(
                              (
                                character,
                                index
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  className={`
                                    flex-1
                                    rounded-xl
                                    border
                                    p-3
                                    text-center
                                    ${
                                      item
                                        .result[
                                        index
                                      ] ===
                                      "correct"
                                        ? "border-green-500/40 bg-green-500/10"
                                        : "border-red-500/20 bg-red-500/10"
                                    }
                                  `}
                                >
                                  <div className="text-xl font-black">
                                    {
                                      character
                                    }
                                  </div>
                                </div>
                              )
                            )}

                        </div>
                      </div>
                    )
                  )}

                </div>

              </section>
            )}

          </>
        )}

        {/* PASSWORD STEP */}

        {(step ===
          "password" ||
          step === "won") && (
          <>

            {/* SUCCESS */}

            <section className="max-w-3xl mx-auto mb-10 rounded-3xl border border-green-500/20 bg-green-500/5 p-6 md:p-8">

              <div className="flex items-start gap-4">

                <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="text-green-400" />
                </div>

                <div>

                  <p className="text-xs uppercase tracking-widest text-green-500 font-bold mb-1">
                    1-BOSQICH TUGADI
                  </p>

                  <h2 className="text-xl md:text-2xl font-black">
                    4 ta belgi topildi!
                  </h2>

                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Endi 8 belgili yakuniy
                    passwordni to'ldiring.
                    Birinchi 4 ta belgi siz
                    topgan koddan avtomatik
                    joylashtirildi.
                  </p>

                </div>

              </div>

            </section>

            {/* SOURCES */}

            <section className="max-w-3xl mx-auto mb-10 rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-6 md:p-8">

              <div className="mb-6">

                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                  5–8-BELGILAR
                </p>

                <h2 className="text-xl md:text-2xl font-black mt-1">
                  Qolgan belgilarni qayerdan topish mumkin?
                </h2>

                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Qolgan 4 ta belgini quyidagi
                  bo'limlardan toping.
                </p>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {passwordSources.map(
                  (
                    source
                  ) => (
                    <a
                      key={
                        source.position
                      }
                      href={
                        source.route
                      }
                      className="group rounded-2xl border border-zinc-800 bg-zinc-950/70 hover:border-zinc-600 hover:bg-zinc-900 p-5 transition"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex items-start gap-3">

                          <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl">
                            {
                              source.icon
                            }
                          </div>

                          <div>

                            <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                              {
                                source.position
                              }
                              -belgi
                            </p>

                            <h3 className="font-black mt-1">
                              {
                                source.title
                              }
                            </h3>

                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                              {
                                source.description
                              }
                            </p>

                          </div>

                        </div>

                        <ExternalLink
                          size={
                            17
                          }
                          className="text-zinc-600 group-hover:text-green-400 transition shrink-0"
                        />

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          revealSecret(
                            source.position
                          )
                        }
                        className="mt-4 text-xs text-green-500 font-bold"
                      >
                        Ko'rish
                      </button>

                    </a>
                  )
                )}

              </div>

            </section>

            {/* FINAL PASSWORD */}

            <section className="max-w-3xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl p-6 md:p-10 shadow-2xl">

              <div className="text-center mb-8">

                <div className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center bg-zinc-950 border border-zinc-800">

                  {step ===
                  "won" ? (
                    <Unlock
                      size={
                        30
                      }
                      className="text-green-400"
                    />
                  ) : (
                    <Lock
                      size={
                        30
                      }
                      className="text-green-400"
                    />
                  )}

                </div>

                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">
                  YAKUNIY BOSQICH
                </p>

                <h2 className="text-2xl md:text-3xl font-black">
                  {step ===
                  "won"
                    ? "KOD BUZILDI!"
                    : "8 TA PASSWORDNI KIRITING"}
                </h2>

                <p className="text-zinc-500 text-sm mt-2">
                  Birinchi 4 ta belgi
                  avtomatik joylashtirilgan.
                  Qolgan 4 tasini o'zingiz
                  kiriting.
                </p>

              </div>

              {/* 8 INPUTS */}

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 mb-7">

                {finalPassword.map(
                  (
                    character,
                    index
                  ) => {

                    const locked =
                      index < 4;

                    return (
                      <div
                        key={
                          index
                        }
                        className="relative"
                      >

                        <input
                          id={`final-${index}`}
                          value={
                            character
                          }
                          onChange={(
                            event
                          ) =>
                            handleFinalChange(
                              index,
                              event.target.value
                            )
                          }
                          onKeyDown={(
                            event
                          ) =>
                            handleFinalKeyDown(
                              index,
                              event
                            )
                          }
                          maxLength={
                            1
                          }
                          disabled={
                            locked ||
                            step ===
                              "won"
                          }
                          autoComplete="off"
                          className={`
                            w-full
                            h-16
                            sm:h-20
                            rounded-2xl
                            text-center
                            text-2xl
                            sm:text-3xl
                            font-black
                            uppercase
                            outline-none
                            transition
                            ${
                              locked
                                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                                : "bg-zinc-950 border border-zinc-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            }
                          `}
                          aria-label={`Password ${
                            index +
                            1
                          }`}
                        />

                        {locked && (
                          <Lock
                            size={
                              11
                            }
                            className="absolute top-2 right-2 text-green-500/50"
                          />
                        )}

                      </div>
                    );
                  }
                )}

              </div>

              {/* ERROR */}

              {error && (
                <div className="max-w-md mx-auto mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* MESSAGE */}

              {message && (
                <div className="max-w-md mx-auto mb-5 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-400">
                  {message}
                </div>
              )}

              {/* SUBMIT */}

              {step !==
              "won" ? (
                <button
                  type="button"
                  onClick={
                    submitFinalPassword
                  }
                  disabled={
                    !finalPasswordComplete ||
                    finalLoading
                  }
                  className="
                    w-full max-w-md mx-auto
                    flex items-center justify-center
                    gap-2
                    px-6 py-4
                    rounded-2xl
                    bg-green-600
                    hover:bg-green-500
                    disabled:bg-zinc-800
                    disabled:text-zinc-600
                    disabled:cursor-not-allowed
                    text-white
                    font-black
                    transition
                  "
                >

                  <Unlock size={19} />

                  {finalLoading
                    ? "TEKSHIRILMOQDA..."
                    : "8 BELGILI KODNI TEKSHIRISH"}

                </button>
              ) : (
                <div className="text-center">

                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 font-black">

                    <Unlock
                      size={
                        19
                      }
                    />

                    PASSWORD OCHILDI

                  </div>

                </div>
              )}

              <button
                type="button"
                onClick={
                  resetGame
                }
                className="flex items-center justify-center gap-2 mx-auto mt-5 text-xs text-zinc-600 hover:text-zinc-300 transition"
              >

                <RotateCcw
                  size={
                    13
                  }
                />

                QAYTA BOSHLASH

              </button>

            </section>

          </>
        )}

        {/* HELP */}

        <section className="max-w-3xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">

            <Eye
              size={
                19
              }
              className="text-green-400 mb-3"
            />

            <h3 className="font-bold mb-1">
              1–4
            </h3>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Birinchi 4 ta belgini
              guess qilib toping.
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">

            <Search
              size={
                19
              }
              className="text-blue-400 mb-3"
            />

            <h3 className="font-bold mb-1">
              5–8
            </h3>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Math Sprint, SAT,
              Olympiad va Certificate
              bo'limlaridan toping.
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">

            <Lock
              size={
                19
              }
              className="text-yellow-400 mb-3"
            />

            <h3 className="font-bold mb-1">
              8 ta belgi
            </h3>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Barcha 8 ta belgini
              birlashtirib passwordni
              oching va 700 GP oling.
            </p>

          </div>

        </section>

        <footer className="text-center mt-12">

          <p className="text-xs text-zinc-700">
            Only Math • Guess the Password
          </p>

        </footer>

      </div>
    </main>
  );
}