import {
  useMitre,
} from "../../hooks/useMitre";

import TechniqueCard
from "../../components/Mitre/TechniqueCard";

export default function MitrePage() {

  const { techniques } =
    useMitre();

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        MITRE ATT&CK Mapping
      </h1>

      <div
        className="
        grid
        grid-cols-3
        gap-4"
      >

        {techniques.map((t, idx) => (

          <TechniqueCard
            key={idx}
            technique={t}
          />

        ))}

      </div>

    </div>
  );
}