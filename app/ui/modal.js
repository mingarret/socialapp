"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl relative">
        {/* ❌ Botón de cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* 📌 Contenido del modal */}
        {children}
      </div>
    </div>
  );
}
