"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function NavBar({ session }) {
  const path = usePathname();

  const links = [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/search", icon: MagnifyingGlassIcon, label: "Search" },
    { href: "/create", icon: PlusCircleIcon, label: "Create" },
    { href: "/profile", icon: UserIcon, label: "Profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-64 h-full bg-white p-6 shadow-lg border-r border-gray-200 flex flex-col justify-between">
      {/* Logo y navegación */}
      <div>
        <h1 className="mb-10 text-2xl font-extrabold text-gray-800">
          Social App
        </h1>
        <ul className="flex flex-col gap-6">
          {links.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-50 transition-all duration-200",
                  {
                    "bg-indigo-100 text-indigo-600 font-semibold": path === href,
                    "text-gray-700": path !== href,
                  }
                )}
              >
                <Icon
                  className={clsx("h-6 w-6", {
                    "text-indigo-600": path === href,
                    "text-gray-500": path !== href,
                  })}
                />
                <span className="text-sm">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Login / Logout en la parte inferior */}
      <div className="border-t pt-4">
        {session ? (
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">{session.user.name}</span>
            <Link
              href="/auth/logout"
              className="text-sm text-red-500 hover:underline mt-2"
            >
              Logout
            </Link>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="block text-center text-sm text-blue-500 hover:underline"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
