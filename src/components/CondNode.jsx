import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
const handleStyle = { left: 10 };

export default function CondNode({ data }) {
  const [action, setAction] = useState(false);
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  const handleDeleteFlow = () => {
    setAction(!action);
    data.deleteFlow(data.id);
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={"node-content" + (action?" action":"")}>
        <img src="/icon-type.png" className="node-type" />
        <p className="node-label">{data.label}</p>
        <img src="/avatar.png" className="node-avatar" />
        <button className="btn-actions" onClick={() => setAction(!action)}>...</button>
        <ul className="actions">
            <li><button className="btn-delete" onClick={handleDeleteFlow}>Delete</button></li>
        </ul>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}