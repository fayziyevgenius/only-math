"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  name: string;
  surname: string;
  email: string;
  username: string;
  birthday: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto">

        <div className="border border-gray-700 rounded-3xl p-6 md:p-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8">

            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-800 flex items-center justify-center text-5xl">
              👤
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold">
                {user.name} {user.surname}
              </h1>

              <p className="text-gray-400 mt-2 text-lg break-all">
                @{user.username}
              </p>
            </div>

          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-xl md:text-2xl break-words">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Surname</p>
              <p className="text-xl md:text-2xl break-words">
                {user.surname}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-xl md:text-2xl break-all">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Username</p>
              <p className="text-xl md:text-2xl break-all">
                @{user.username}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Birthday</p>
              <p className="text-xl md:text-2xl break-words">
                {user.birthday}
              </p>
            </div>

          </div>

          <Link href="/edit-profile">
  <button className="mt-12 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
    Edit Profile
  </button>
</Link>

        </div>

      </div>
    </div>
  );
}