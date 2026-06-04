export default function Navbar() {
  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
      <h1 className="font-semibold">
        Digital Forensics Dashboard
      </h1>

      <div>
        <button className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700">
          Import Evidence
        </button>
      </div>
    </header>
  );
}