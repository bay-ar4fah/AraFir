export default function Navbar() {
  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
      <h1 className="font-semibold">
        Digital Forensics Dashboard
      </h1>

      <div
  className="
    px-4
    py-2
    rounded-lg
    border
    border-green-500/30
    bg-green-500/10
    text-green-400
    text-sm
    font-medium
  "
>
  System Ready
</div>
    </header>
  );
}