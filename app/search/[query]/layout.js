export default function SearchLayout({ children }) {
    return (
      <div className="flex flex-col items-center p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Buscar Usuarios</h1>
        {children}
      </div>
    );
  }
  