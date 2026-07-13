"use client";

import { useEffect, useState } from "react";

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
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">

        <div className="border border-gray-700 rounded-3xl p-10">

          <div className="flex items-center gap-8">

            <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-5xl">
              👤
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                {user.name} {user.surname}
              </h1>

              <p className="text-gray-400 mt-2">
                @{user.username}
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-8 mt-12">

            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-2xl">{user.name}</p>
            </div>

            <div>
              <p className="text-gray-400">Surname</p>
              <p className="text-2xl">{user.surname}</p>
            </div>

            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-2xl">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-400">Username</p>
              <p className="text-2xl">{user.username}</p>
            </div>

            <div>
              <p className="text-gray-400">Birthday</p>
              <p className="text-2xl">{user.birthday}</p>
            </div>

          </div>

          <button className="mt-12 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
            Edit Profile
          </button>

        </div>

      </div>
    </div>
  );
}