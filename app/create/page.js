"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../lib/action";
import Image from "next/image";
import Skeleton from "../ui/Skeleton"; // 🔹 Importamos Skeleton Loader

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("/preview1.jpg"); // Imagen de preview por defecto
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // ✅ Simular carga inicial de la página (opcional)
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // Simula carga inicial
  }, []);

  // 🔄 Manejar arrastrar y soltar imagen
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔄 Manejar selección de imagen
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Manejo de envío del post
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image || !content) {
      alert("⚠️ Debes añadir una imagen y contenido antes de publicar.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("media", image);
    formData.append("content", content);

    await createPost(formData);

    setSuccess(true);
    setContent("");
    setImage(null);
    setPreview("/preview1.jpg");

    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        {/* 📂 Zona de arrastrar y soltar imagen */}
        <div
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current && inputRef.current.click()}
        >
          {isLoading ? (
            <Skeleton height="250px" width="100%" className="rounded-lg" />
          ) : (
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={400}
              className="rounded-lg object-cover mx-auto"
            />
          )}
          <p className="text-gray-500 mt-2">📂 Arrastra una imagen aquí o haz clic para seleccionar</p>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* ✏️ Campo de texto */}
        <div>
          <label htmlFor="content" className="block mb-2 text-sm font-medium text-black">
            Contenido
          </label>
          {isLoading ? (
            <Skeleton height="40px" width="100%" className="rounded-lg" />
          ) : (
            <input
              name="content"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 rounded-lg border bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Escribe algo sobre tu imagen..."
            />
          )}
        </div>

        {/* ✅ Mensaje de éxito */}
        {success && (
          <p className="text-green-500 text-sm text-center">
            ✅ ¡Post creado con éxito!
          </p>
        )}

        {/* Botones */}
        <div className="flex justify-between">
          {isLoading ? (
            <>
              <Skeleton height="40px" width="45%" className="rounded-lg" />
              <Skeleton height="40px" width="45%" className="rounded-lg" />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-slate-500 text-white py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Publicar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
