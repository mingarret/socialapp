import Image from "next/image";
import { getUserProfile } from "@/app/lib/action";
import ProfileTabs from "./ProfileTabs"; // ✅ Importamos el componente cliente



export default function ProfileLayout({ children }) {
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10 min-h-[600px]">
      {/* 🔹 Navegación de Tabs */}
      <ProfileTabs />

      {children}
    </div>
  );
}
