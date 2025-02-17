import Image from "next/image";
import { getUserProfile } from "@/app/lib/action";
import Link from "next/link";


export default async ({children}) => {
 
  const profile = await getUserProfile();
  
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10 min-h-[600px]">
      {/* 🔹 Información del Usuario */}
      <div className="flex items-center gap-6 mb-8">
        <Image src={profile.picture || "/avatar-default.png"} alt="Perfil" width={100} height={100} className="rounded-full" />
        <div>
          <h2 className="text-3xl font-bold text-black">{profile.name}</h2>
          <p className="text-gray-600 text-lg">{profile.email}</p>
        </div>
      </div>

      {/* 🔹 Tabs de Navegación */}
      <div className="flex border-b mb-8 text-lg">
        {["posts", "comments", "likes"].map((tab) => (
          <Link
          href={`/profile/${tab}`}
            key={tab}
            className={`px-6 py-3 font-semibold transition ${
              false ? "border-b-4 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "posts" ? "Publicaciones" : tab === "comments" ? "Comentarios" : "Likes"}
          </Link>
        ))}
      </div>


        {children}
        
    </div>
  );
}
