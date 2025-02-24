import Image from "next/image";
import { getUserProfile } from "@/app/lib/action";

export default async function ProfileLayout({ children, params }) {
  const { user_id } = params; // ✅ Obtener el user_id de la URL
  const loggedUser = await getUserProfile(); // ✅ Obtener el usuario logueado

  const isOwnProfile = loggedUser?.user_id === user_id; // ✅ Comparar si es su perfil

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10 min-h-[600px]">
      {/* 🔹 Mostrar pestañas solo si es su propio perfil */}
      {isOwnProfile && <ProfileTabs />}

      {children}
    </div>
  );
}
