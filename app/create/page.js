"use client";

import { createPost } from "../lib/actions";
import ImageSelector from "../ui/image-selector";

export default function CreatePostPage() {
  return (
    <div className="flex flex-col grow gap-16 mt-16 items-center">
      <form action={createPost} className="flex flex-col gap-6 w-full max-w-md">
        <div>
          <ImageSelector />
        </div>
        <div>
          <label htmlFor="content" className="block mb-2 text-sm">
            Contenido
          </label>
          <input
            name="content"
            id="content"
            className="w-full p-2 rounded-lg border dark:bg-neutral-900 dark:border-neutral-800"
          />
        </div>
        <button
          type="submit"
          className="bg-slate-500 text-white py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
        >
          Publicar
        </button>
      </form>
    </div>
  );
}
