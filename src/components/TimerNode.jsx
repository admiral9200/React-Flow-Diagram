import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
const handleStyle = { left: 10 };

export default function TimerNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="node-content timer">
        <p className="node-label">Timer</p>
        <button className="timer-btn-delete">*</button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}