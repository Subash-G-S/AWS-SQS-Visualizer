import { Handle, Position } from "reactflow";
import { memo } from "react";
function ApiNode({ data }) {
  return (
    <div
      style={{
        background: "#2563eb",
        color: "white",
        padding: "12px 20px",
        borderRadius: "10px",
      }}
    >
      {data.active && <div>🟢</div>}

      API

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
export default memo(ApiNode);