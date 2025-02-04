"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  FiHome,
  FiSearch,
  FiPlusSquare,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

export default function NavBar({ session }) {
  const path = usePathname();

  const links = [
    { href: "/", icon: FiHome, label: "Inicio" },
    { href: "/search", icon: FiSearch, label: "Buscar" },
    { href: "/create", icon: FiPlusSquare, label: "Crear" },
    { href: "/profile", icon: FiUser, label: "Perfil" },
  ];

  return (
    <nav className="fixed top-0 left-4 w-64 h-full bg-gray-900 shadow-lg border-r border-white/20 p-6 flex flex-col justify-between rounded-lg">
      <div>
        <h1 className="mb-10 text-2xl font-extrabold text-white">
          📸 Social App
        </h1>
        <ul className="flex flex-col gap-6">
          {links.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200",
                  { "bg-gray-800 text-white font-semibold": path === href }
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4 border-white/20">
        {session ? (
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-white">{session.user.name}</span>
            <Link href="/auth/logout" className="flex items-center gap-2 text-sm text-red-400 hover:underline mt-2">
              <FiLogOut className="h-5 w-5" /> Logout
            </Link>
          </div>
        ) : (
          <Link href="/auth/login" className="block text-center text-sm text-blue-400 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
