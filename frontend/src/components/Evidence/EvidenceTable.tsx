import type { Evidence } from "../../types/evidence";

interface Props {
  evidence: Evidence[];
}

export default function EvidenceTable({
  evidence,
}: Props) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">

      <table className="w-full">

        <thead>
          <tr className="border-b border-zinc-800 text-left">
            <th className="p-4">Filename</th>
            <th className="p-4">Type</th>
            <th className="p-4">Size</th>
            <th className="p-4">SHA256</th>
            <th className="p-4">Imported</th>
          </tr>
        </thead>

        <tbody>
          {evidence.map((item) => (
            <tr
              key={item.id}
              className="border-b border-zinc-800"
            >
              <td className="p-4">
                {item.filename}
              </td>

              <td className="p-4">
                {item.fileType}
              </td>

              <td className="p-4">
                {item.size.toLocaleString()}
              </td>

              <td className="p-4">
                {item.sha256.substring(0, 20)}...
              </td>

              <td className="p-4">
                {item.importedAt}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}