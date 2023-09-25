import { useCallback } from 'react';
import { useStore, getStraightPath } from 'reactflow';

import { getEdgeParams } from '../utils.js';

function FloatingEdge({ id, data, source, target, markerEnd, style }) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  const _style = Object.assign({}, style)
  if (data?.color) {
    let c = data.color
    _style.stroke = `rgba(${c.r},${c.g},${c.b},${c.a})`
  }

  return (
    <path
      d={edgePath}
      id={id}
      style={_style}
      markerEnd={markerEnd}
      className="react-flow__edge-path"
    />
  )
}

export default FloatingEdge;
