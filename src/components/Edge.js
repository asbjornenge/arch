import { useCallback } from 'react';
import { useStore, getStraightPath, EdgeLabelRenderer } from 'reactflow';
//import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';

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

  let label_y_pos = sy
  if (sy > ty) label_y_pos -= Math.abs(sy-ty)/2
  if (sy <= ty) label_y_pos += Math.abs(sy-ty)/2
  let label_x_pos = sx
  if (sx > tx) label_x_pos -= Math.abs(sx-tx)/2
  if (sx <= tx) label_x_pos += Math.abs(sx-tx)/2

  let label_style = {
    background: 'red',
    fontSize: '2em'
  }

  return (
    <>
      <path
        d={edgePath}
        id={id}
        style={_style}
        markerEnd={markerEnd}
        className="react-flow__edge-path"
      />
      <text 
        x={label_x_pos} 
        y={label_y_pos} 
        style={label_style}
        text-anchor="middle" 
        dominant-baseline="middle"
      >{data?.label}</text>
    </>
  )
}

export default FloatingEdge;
