"use client";

import {
  Send,
  Globe,
  ArrowUpRight,
} from "lucide-react";

function InstagramIcon({
  size = 30,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

function YouTubeIcon({
  size = 30,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M23.5 6.2C23.2 5.1 22.3 4.2 21.2 3.9C19.2 3.4 12 3.4 12 3.4C12 3.4 4.8 3.4 2.8 3.9C1.7 4.2 0.8 5.1 0.5 6.2C0 8.2 0 12 0 12C0 12 0 15.8 0.5 17.8C0.8 18.9 1.7 19.8 2.8 20.1C4.8 20.6 12 20.6 12 20.6C12 20.6 19.2 20.6 21.2 20.1C22.3 19.8 23.2 18.9 23.5 17.8C24 15.8 24 12 24 12C24 12 24 8.2 23.5 6.2Z"
        fill="currentColor"
      />

      <path
        d="M9.6 15.4L15.8 12L9.6 8.6V15.4Z"
        fill="black"
      />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Telegram",
    username: "@onlymathoffical",
    description:
      "Join our official Telegram channel",
    href: "https://t.me/onlymathoffical",
    icon: Send,
    iconClass: "text-sky-400",
    bgClass: "bg-sky-500/10",
    borderClass: "border-sky-500/20",
  },

  {
    name: "Instagram",
    username: "@onlymath",
    description:
      "Follow Only Math on Instagram",
    icon: InstagramIcon,
    iconClass: "text-pink-400",
    bgClass: "bg-pink-500/10",
    borderClass: "border-pink-500/20",
  },

  {
    name: "YouTube",
    username: "Only Math",
    description:
      "Watch math lessons and problem solutions",
    
    icon: YouTubeIcon,
    iconClass: "text-red-400",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/20",
  },

  {
    name: "Website",
    username: "onlymath.app",
    description:
      "Practice mathematics on our platform",
    href: "https://www.onlymath.app",
    icon: Globe,
    iconClass: "text-green-400",
    bgClass: "bg-green-500/10",
    borderClass: "border-green-500/20",
  },
];

export default function SocialPage() {
  return (
    <div className="w-full max-w-6xl mx-auto pb-24">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[30px] border border-zinc-800 bg-zinc-950 mb-10">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative p-8 sm:p-10 lg:p-14">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-6 shadow-2xl">
              <img
                src="/logo.png"
                alt="Only Math"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold mb-5">
              <span>✦</span>
              <span>ONLY MATH COMMUNITY</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Stay connected.
            </h1>

            <p className="mt-4 text-zinc-400 text-base sm:text-lg max-w-2xl leading-7">
              Follow Only Math on social media and stay
              updated with new problems, Olympiads, SAT
              practice, Certificates, competitions and
              announcements.
            </p>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA */}

      <section>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-green-400 font-black">
            Follow us
          </p>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Our social media
          </h2>

          <p className="text-zinc-500 mt-2">
            Choose a platform and join the Only Math
            community.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {socialLinks.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-zinc-800
                  bg-zinc-950
                  p-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-zinc-600
                  hover:bg-zinc-900
                "
              >
                <div
                  className={`
                    absolute
                    -top-16
                    -right-16
                    w-40
                    h-40
                    rounded-full
                    blur-3xl
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    ${social.bgClass}
                  `}
                />

                <div className="relative flex items-center gap-5">
                  <div
                    className={`
                      shrink-0
                      w-16
                      h-16
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      border
                      ${social.bgClass}
                      ${social.borderClass}
                    `}
                  >
                    <Icon
                      size={30}
                      className={social.iconClass}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white">
                        {social.name}
                      </h3>

                      <ArrowUpRight
                        size={18}
                        className="
                          text-zinc-600
                          group-hover:text-white
                          transition
                        "
                      />
                    </div>

                    <p className="text-sm text-zinc-500 mt-1">
                      {social.username}
                    </p>

                    <p className="text-sm text-zinc-400 mt-2">
                      {social.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* TELEGRAM FEATURE */}

      <section className="mt-10">
        <a
          href="https://t.me/onlymathoffical"
          target="_blank"
          rel="noopener noreferrer"
          className="
            group
            relative
            overflow-hidden
            block
            rounded-[28px]
            border
            border-sky-500/20
            bg-sky-500/5
            p-7
            sm:p-9
            transition-all
            duration-300
            hover:border-sky-400/40
            hover:bg-sky-500/10
          "
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Send
                size={30}
                className="text-sky-400"
              />
            </div>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-sky-400 font-black">
                Official Telegram
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                @onlymathoffical
              </h2>

              <p className="text-zinc-400 mt-2">
                Get the latest Only Math announcements,
                problems, competitions and updates.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sky-400 font-bold">
              Join channel

              <ArrowUpRight
                size={20}
                className="
                  group-hover:translate-x-1
                  group-hover:-translate-y-1
                  transition
                "
              />
            </div>
          </div>
        </a>
      </section>

      {/* BOTTOM */}

      <section className="mt-10 rounded-[26px] border border-zinc-800 bg-zinc-950 p-7 text-center">
        <div className="text-3xl mb-3">
          🧠
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white">
          Mathematics is better together.
        </h2>

        <p className="text-zinc-500 mt-2 max-w-xl mx-auto">
          Solve more. Learn more. Compete more. Become
          better every day with Only Math.
        </p>
      </section>
    </div>
  );
}