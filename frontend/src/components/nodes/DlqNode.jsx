import { Handle, Position } from "reactflow";
import { memo } from "react";
function DlqNode({ data }) {
  return (
    <div
      style={{
        background: "#dc2626",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        minWidth: "100px",
        textAlign: "center",
      }}
    >
      <Handle type="target" position={Position.Left} />

      <div>DLQ</div>

      <div
        style={{
          fontSize: "12px",
          marginTop: "5px",
        }}
      >
        Messages: {data.dlqCount}
      </div>
    </div>
  );
}
export default memo(DlqNode);