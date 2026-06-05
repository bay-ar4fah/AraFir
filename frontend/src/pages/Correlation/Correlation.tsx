import {
  useCorrelation,
} from "../../hooks/useCorrelation";

import AttackChainView
from "../../components/Correlation/AttackChain";

export default function CorrelationPage() {

  const { chains } =
    useCorrelation();

  return (

    <div className="p-6">

      <h1
        className="
        text-3xl
        font-bold
        mb-6"
      >
        Correlation Engine
      </h1>

      <div className="space-y-4">

        {chains.map(
          (chain) => (

            <AttackChainView
              key={chain.id}
              chain={chain}
            />

          )
        )}

      </div>

    </div>

  );

}