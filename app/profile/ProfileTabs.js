"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileTabs() {
  const pathname = usePathname();
  
  return (
    <div className="flex border-b mb-8 text-lg">
      {["posts", "comments", "likes"].map((tab) => {
        const isActive = pathname.includes(`/profile/${tab}`);

        return (
          <Link
            key={tab}
            href={`/profile/${tab}`}
            className={`px-6 py-3 font-semibold transition ${
              isActive ? "border-b-4 border-blue-500 text-blue-500 bg-gray-200" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "posts" ? "Publicaciones" : tab === "comments" ? "Comentarios" : "Likes"}
          </Link>
        );
      })}
    </div>
  );
}
