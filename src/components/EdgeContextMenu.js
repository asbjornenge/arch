import React, { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import './NodeContextMenu.css'

export default function ContextMenu({ id, top, left, right, bottom, setEdge, ...props }) {
  const { getEdge, setEdges } = useReactFlow();

//  const node = getEdge(id)

  const deleteEdge = useCallback(() => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id))
  }, [id, setEdges]);

  const editEdge = useCallback(() => {
    const edge = getEdge(id)
    setEdge(edge)
  }, [id, setEdge, getEdge])

  return (
    <div style={{ top, left, right, bottom }} className="context-menu" {...props}>
      <button onClick={editEdge}>edit</button>
      <button onClick={deleteEdge}>delete</button>
    </div>
  );
}

