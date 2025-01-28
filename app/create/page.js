"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../lib/actions";
import ImageSelector from "../ui/image-selector";

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCancel = () => {
    setContent(""); // Limpia el contenido
    router.push("/"); // Redirige al inicio
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    await createPost(formData);

    setSuccess(true);
    setContent("");

    // Espera 1.5s antes de redirigir para mostrar el mensaje
    setTimeout(() => {
      router.push("/"); // Ajusta esta ruta si es diferente en tu app
    }, 1500);
  };

  return (
    <div className="flex flex-col grow gap-16 mt-16 items-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md">
        <div>
          <ImageSelector />
        </div>
        <div>
          <label htmlFor="content" className="block mb-2 text-sm">Contenido</label>
          <input
            name="content"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 rounded-lg border bg-white text-black"
          />
        </div>

        {/* Mensaje de éxito */}
        {success && <p className="text-green-500 text-sm text-center">✅ ¡Post creado con éxito!</p>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-slate-500 text-white py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}
