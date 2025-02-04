import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/nav-bar";
import { auth0 } from "./lib/auth0";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Social App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const session = await auth0.getSession();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen bg-gray-900 text-white`}>
        {session ? (
          <>
            {/* ✅ Navbar flotante con separación */}
            <Navbar session={session} />

            {/* ✅ Contenido principal con margen a la izquierda */}
            <main className="flex-1 flex flex-col items-center bg-gray-800 text-white ml-72 min-h-screen p-6">
              {children}
            </main>
          </>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-semibold mb-4">Inicia sesión</h2>
              <p className="text-gray-600 mb-6">
                Para ver el contenido de la aplicación, inicia sesión.
              </p>
              <Link
                href="/auth/login"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
