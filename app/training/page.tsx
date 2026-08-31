"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, Sparkles, ArrowLeft } from "lucide-react";

export default function TrainingPage() {
  return (
    <div className="min-h-[calc(100vh-40px)] flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-green-500/20
            bg-zinc-950/80
            backdrop-blur-xl
            p-8
            md:p-12
            shadow-2xl
          "
        >
          {/* Background glow */}
          <div
            className="
              absolute
              -top-32
              -right-32
              w-80
              h-80
              rounded-full
              bg-green-500/10
              blur-3xl
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -left-32
              w-80
              h-80
              rounded-full
              bg-blue-500/10
              blur-3xl
              pointer-events-none
            "
          />

          <div className="relative z-10 text-center">
            {/* Icon */}
            <div
              className="
                mx-auto
                mb-6
                w-20
                h-20
                rounded-2xl
                flex
                items-center
                justify-center
                bg-green-500/10
                border
                border-green-500/20
                shadow-lg
              "
            >
              <BookOpen
                size={38}
                className="text-green-400"
              />
            </div>

            {/* Badge */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-green-500/10
                border
                border-green-500/20
                text-green-400
                text-xs
                font-bold
                uppercase
                tracking-widest
                mb-5
              "
            >
              <Sparkles size={14} />
              Training
            </div>

            {/* Title */}
            <h1
              className="
                text-3xl
                md:text-5xl
                font-black
                text-white
                mb-5
              "
            >
              Training is coming soon
            </h1>

            {/* Description */}
            <p
              className="
                text-zinc-400
                text-base
                md:text-lg
                leading-relaxed
                max-w-2xl
                mx-auto
              "
            >
              Cycle tugaganidan so‘ng shu yerga ushbu
              cycle davomida berilgan savollar va
              maxsus training materiallari qo‘shiladi.
            </p>

            {/* Divider */}
            <div className="my-8 h-px bg-zinc-800" />

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div
                className="
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-900/60
                  p-5
                  text-left
                "
              >
                <div className="flex items-center gap-3 mb-3">
                  <CalendarDays
                    size={20}
                    className="text-green-400"
                  />

                  <span className="font-bold text-white">
                    After each cycle
                  </span>
                </div>

                <p className="text-sm text-zinc-500 leading-relaxed">
                  Cycle yakunlangach, Daily Challenge
                  savollari shu bo‘limda training sifatida
                  saqlanadi.
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-900/60
                  p-5
                  text-left
                "
              >
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen
                    size={20}
                    className="text-blue-400"
                  />

                  <span className="font-bold text-white">
                    Practice
                  </span>
                </div>

                <p className="text-sm text-zinc-500 leading-relaxed">
                  Oldingi cycle savollarini qayta ishlab,
                  bilimlaringizni mustahkamlashingiz mumkin.
                </p>
              </div>
            </div>

            {/* Status */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-zinc-900
                border
                border-zinc-800
                px-5
                py-3
                text-sm
                text-zinc-400
              "
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Training materials are being prepared
            </div>

            {/* Back button */}
            <div className="mt-8">
              <Link
                href="/afterregister"
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-green-600
                  hover:bg-green-500
                  text-white
                  font-bold
                  transition
                  shadow-lg
                  shadow-green-900/20
                "
              >
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-zinc-600 mt-5">
          Only Math • Training Archive
        </p>
      </div>
    </div>
  );
}