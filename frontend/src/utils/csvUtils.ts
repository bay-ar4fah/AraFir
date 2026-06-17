export function exportCsv(
  filename: string,
  rows: Record<string, unknown>[]
) {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header];

          const safeValue =
            value === null || value === undefined
              ? ""
              : String(value).replace(/"/g, '""');

          return `"${safeValue}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}