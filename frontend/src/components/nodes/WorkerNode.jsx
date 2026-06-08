import { Handle, Position } from "reactflow";
import { memo } from "react";
function WorkerNode({ data }) {
  return (
    <div
      style={{
        background: "green",
        color: "white",
        padding: "12px 20px",
        borderRadius: "10px",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
      />

      {data.active && <div>🟢</div>}

      <div>
  {data.workerDown ? "Worker ❌" : "Worker ✅"}
</div>

<div
  style={{
    fontSize: "12px",
    marginTop: "5px",
  }}
>
  Processed: {data.processedCount}
  <div
  style={{
    fontSize: "12px",
    marginTop: "4px",
  }}
>
  Speed: {data.workerSpeed}/sec
</div>
</div>
    </div>
  );
}
export default memo(WorkerNode);