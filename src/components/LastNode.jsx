import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function LastNode({ data }) {
  const [action, setAction] = useState(false);
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="last-node" onClick={() => data.addActionLast()}>
        +
      </div>
    </>
  );
}