import { Handle, Position } from "reactflow";
import { memo } from "react";
function SqsNode({ data }) {
  return (
    <div
      style={{
        background: "orange",
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

      <div>SQS</div>

    <div
    style={{
        fontSize: "12px",
        marginTop: "5px",
    }}
    >
  Queue: {data.queueCount}/{data.maxQueueSize}
  <div
  style={{
    marginTop: "10px",
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    justifyContent: "center",
  }}
>
  {Array.from({
    length: Math.min(data.queueCount, 20),
  }).map((_, index) => (
    <div
      key={index}
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "white",
      }}
    />
  ))}
</div>
  <div
  style={{
    fontSize: "12px",
    marginTop: "4px",
  }}
>
  Dropped: {data.droppedCount}
  
</div>
<div
  style={{
    color: "#ffdddd",
    fontSize: "11px",
  }}
>
  {data.droppedCount > 0
    ? "⚠ Queue Overflow"
    : ""}
</div>

</div>

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
export default memo(SqsNode);