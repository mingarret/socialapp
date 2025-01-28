'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageSelector() {
  const [imgUrl, setImgUrl] = useState('/preview1.jpg'); // Imagen inicial
  const [dragging, setDragging] = useState(false); // Estado para resaltar el área de arrastre

  // Manejo del evento al arrastrar sobre el área
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true); // Resalta el área
  };

  // Manejo del evento al salir del área de arrastre
  const handleDragLeave = () => {
    setDragging(false); // Quita el resaltado
  };

  // Manejo del evento de soltar
  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false); // Quita el resaltado
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImgUrl(URL.createObjectURL(file)); // Actualiza la imagen a la previsualización
      document.querySelector('#imgpost').files = event.dataTransfer.files; // Asigna el archivo al input
    } else {
      alert('Por favor, arrastra un archivo de imagen válido.');
    }
  };

  // Manejo del evento de seleccionar archivo
  const preview = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImgUrl(URL.createObjectURL(file));
    } else {
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-4 ${
        dragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
      }`}
    >
      <label htmlFor="imgpost" className="block mb-2 text-sm text-center">
        <Image
          src={imgUrl}
          alt="preview"
          width={500}
          height={250}
          className="mx-auto"
        />
        <p className="text-gray-600 mt-2">
          {dragging
            ? 'Suelta aquí la imagen'
            : 'Arrastra y suelta una imagen o haz clic para seleccionarla'}
        </p>
      </label>
      <input
        id="imgpost"
        type="file"
        name="media"
        hidden
        onChange={preview}
      />
    </div>
  );
}
