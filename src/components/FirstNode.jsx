import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function StepNode({ data }) {
  const [action, setAction] = useState(false);
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={"node-content" + (action?" action":"")}>
        <p className="node-label">Sequence start</p>
        <button className="btn-actions" onClick={() => setAction(!action)}>...</button>
        <ul className="actions">
            <li><button className="btn-delete" onClick={() => setAction(!action)}>Delete</button></li>
        </ul>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}