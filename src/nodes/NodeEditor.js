import React, { useState, useEffect } from 'react'
import './NodeEditor.css'

export default function NodeEditor({ node, setNode, setNodes, ...props }) {
  const [label, setLabel] = useState(node?.data?.label)

  useEffect(() => {
    setNodes((nds) =>
      nds.map(n => {
        if (n.id === node.id) {
          n.data = {
            ...n.data,
            label: label,
          }
        }
        return n
      })
    )
  }, [label, node.id, setNodes])

  const handleClose = () => { 
    setNode(null)
  }

  return (
    <div className="NodeEditor">
      <label>label:</label>
      <input value={label} onChange={(evt) => setLabel(evt.target.value)} />
      <div className="buttons">
        <button className="archButton" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}

