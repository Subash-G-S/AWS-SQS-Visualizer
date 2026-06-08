import { useState, useEffect } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

import ApiNode from "../components/nodes/ApiNode";
import SqsNode from "../components/nodes/SqsNode";
import WorkerNode from "../components/nodes/WorkerNode";
import DlqNode from "../components/nodes/DlqNode";

const nodeTypes = {
  api: ApiNode,
  sqs: SqsNode,
  worker: WorkerNode,
  dlq: DlqNode,
};


const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
  },
  {
  id: "e3-4",
  source: "3",
  target: "4",
},
];

export default function Playground() {
  const [messagePosition, setMessagePosition] = useState(null);
  const [queueCount, setQueueCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [workerDown, setWorkerDown] = useState(false);
  const [autoTraffic, setAutoTraffic] = useState(false);
  const [droppedCount, setDroppedCount] = useState(0);
  const MAX_QUEUE_SIZE = 20;
  const PROCESS_INTERVAL = 1000;
  const [workerSpeed, setWorkerSpeed] = useState(1);
  const [dlqCount, setDlqCount] = useState(0);
  const [failureRate, setFailureRate] = useState(20);
  const [logs, setLogs] = useState([]);
  const [producedCount, setProducedCount] = useState(0);


  const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();

  setLogs((prev) => [
    `[${timestamp}] ${message}`,
    ...prev.slice(0, 19),
  ]);
};

  const runSimulation = () => {
    
  setMessagePosition("api");

  setTimeout(() => {
    setQueueCount((prev) => {
  if (prev >= MAX_QUEUE_SIZE) {
    setDroppedCount((d) => d + 1);
    addLog("Message dropped (queue full)");
    return prev;
  }
  setProducedCount((p) => p + 1);
  addLog("Message added to queue");

  return prev + 1;
});
    setMessagePosition("sqs");
  }, 1000);

  setTimeout(() => {
    setMessagePosition(null);
  }, 3000);
};
const resetSimulation = () => {
  setQueueCount(0);
  setProcessedCount(0);
  setDroppedCount(0);
  setDlqCount(0);
  setLogs([]);
  setMessagePosition(null);
};
useEffect(() => {
  if (!autoTraffic) return;

  const interval = setInterval(() => {
    runSimulation();
  }, 1000);

  return () => clearInterval(interval);
}, [autoTraffic, workerDown]);
useEffect(() => {
  if (workerDown) return;

  const interval = setInterval(() => {
    setQueueCount((prevQueue) => {
      if (prevQueue <= 0) return 0;

      const processed = Math.min(workerSpeed, prevQueue);

      for (let i = 0; i < processed; i++) {
  const failed = Math.random() * 100 < failureRate;

  if (failed) {
    setDlqCount((d) => d + 1);
    //addLog("Message sent to DLQ");
  } else {
    setProcessedCount((p) => p + 1);
    //addLog("Worker processed message");
  }
}

      return prevQueue - processed;
    });
  }, PROCESS_INTERVAL);

  return () => clearInterval(interval);
}, [workerDown, workerSpeed, failureRate]);

  const nodes = [
    {
      id: "1",
      type: "api",
      position: { x: 100, y: 150 },
      data: {
        active: messagePosition === "api",
      },
    },
    {
      id: "2",
      type: "sqs",
      position: { x: 400, y: 150 },
      data: {
        active: messagePosition === "sqs",
        queueCount: queueCount,
        droppedCount: droppedCount,
        maxQueueSize: MAX_QUEUE_SIZE,
      },
    },
    {
      id: "3",
      type: "worker",
      position: { x: 700, y: 150 },
      data: {
        active: messagePosition === "worker",
        processedCount: processedCount,
        workerDown: workerDown,
        workerSpeed: workerSpeed,
      },
    },
    {
  id: "4",
  type: "dlq",
  position: { x: 700, y: 350 },
  data: {
    dlqCount: dlqCount,
  },
},
  ];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: "10px",
        }}
      >
        <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  }}
>
  <div>
    <strong>Queue</strong>
    <br />
    {queueCount}
  </div>

  <div>
    <strong>Processed</strong>
    <br />
    {processedCount}
  </div>

  <div>
    <strong>Dropped</strong>
    <br />
    {droppedCount}
  </div>

  <div>
    <strong>DLQ</strong>
    <br />
    {dlqCount}
  </div>
  <div>
  <strong>Produced</strong>
  <br />
  {producedCount}
</div>

  <div>
    <strong>Worker</strong>
    <br />
    {workerDown ? "DOWN ❌" : "UP ✅"}
  </div>
</div>

        <button
          onClick={runSimulation}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Run Simulation
        </button>
        <button
  onClick={resetSimulation}
  style={{
    marginLeft: "10px",
    padding: "10px 20px",
  }}
>
  Reset
</button>
        <label
  style={{
    marginLeft: "20px",
  }}
>
  <input
    type="checkbox"
    checked={workerDown}
    onChange={() => setWorkerDown(!workerDown)}
  />
  Worker Down
</label>
<label
  style={{
    marginLeft: "20px",
  }}
>
  <input
    type="checkbox"
    checked={autoTraffic}
    onChange={() => setAutoTraffic(!autoTraffic)}
  />
  Auto Traffic
</label>
      </div>

      <div
        style={{
          width: "100%",
          height: "90%",
        }}
      >
        <div style={{ marginTop: "10px" }}>
  <strong>Worker Speed:</strong>

  <button
    onClick={() => setWorkerSpeed(1)}
    style={{ marginLeft: "10px" }}
  >
    1
  </button>

  <button
    onClick={() => setWorkerSpeed(2)}
    style={{ marginLeft: "10px" }}
  >
    2
  </button>

  <button
    onClick={() => setWorkerSpeed(5)}
    style={{ marginLeft: "10px" }}
  >
    5
  </button>
</div>
<div style={{ marginTop: "10px" }}>
  <strong>Failure Rate:</strong>

  <button onClick={() => setFailureRate(0)}>
    0%
  </button>

  <button onClick={() => setFailureRate(20)}>
    20%
  </button>

  <button onClick={() => setFailureRate(50)}>
    50%
  </button>
</div>
<div
  style={{
    marginTop: "15px",
    border: "1px solid #ddd",
    padding: "10px",
    height: "150px",
    overflowY: "auto",
  }}
>
  <strong>Event Logs</strong>

  {logs.map((log, index) => (
    <div key={index}>{log}</div>
  ))}
</div>
        <ReactFlow
          nodes={nodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView={false}
          
        />
      </div>
    </div>
  );
}