import Image from "next/image";
import { HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Post = ({ content, url, avatarUrl = "/default-avatar.jpg", likes = 1234 }) => {
  const handleLike = () => {
    console.log("Post liked!");
    // Aquí podrías implementar la lógica de actualización de "likes"
  };

  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex items-center p-4">
        <Image
          src={avatarUrl}
          alt="User avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="ml-3">
          <p className="font-bold">Mondongo</p>
        </div>
      </div>
      <Image
        src={url}
        alt="Post image"
        width={500}
        height={500}
        className="w-full h-auto object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
           
          </div>
        </div>
        <p className="mt-2 text-gray-700">{likes} Me gusta</p>
        <p className="mt-2 text-gray-700">
          <span className="font-bold">Ximo</span> {content}
        </p>
      </div>
    </div>
  );
};

export default Post;