interface Props {
  onSelect: (
    files: FileList
  ) => void;
}

export default function EvidenceUploader({
  onSelect,
}: Props) {

  return (
    <div className="border-2 border-dashed border-zinc-700 rounded-xl p-10 text-center">

      <input
        type="file"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            onSelect(e.target.files);
          }
        }}
      />

    </div>
  );
}