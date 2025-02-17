import { redirect } from "next/navigation";

export default function SearchPage() {
  async function searchUser(formData) {
    "use server";
    const query = formData.get("query");
    if (query.trim()) redirect(`/search/${query}`);
  }

  return (
    <form action={searchUser} className="flex gap-2 bg-white p-4 rounded-lg shadow-md">
      <input
        type="text"
        name="query"
        placeholder="Buscar usuarios..."
        className="border p-2 rounded-lg w-72 text-black"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Buscar
      </button>
    </form>
  );
}
