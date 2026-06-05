import type {
  AttackChain,
} from "../../types/correlation";

export default function AttackChainView({
  chain,
}: {
  chain: AttackChain;
}) {

  return (

    <div
      className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-xl
      p-4"
    >

      <div className="font-bold mb-4">
        Confidence:
        {chain.confidence}%
      </div>

      <div className="flex gap-4">

        {chain.chain.map(
          (node) => (

            <div
              key={
                node.techniqueId
              }
              className="
              bg-zinc-800
              rounded-lg
              px-4
              py-2"
            >

              <div>
                {node.techniqueId}
              </div>

              <div
                className="
                text-sm
                text-zinc-400"
              >
                {node.tactic}
              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}