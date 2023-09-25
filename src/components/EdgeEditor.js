import React, { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import './EdgeEditor.css'

export default function EdgeEditor({ edge, setEdge, setEdges, onChange, ...props }) {
  const [color, setColor] = useState(edge?.data?.color || 'black')
  const [arrowColor, setArrowColor] = useState(edge?.markerEnd?.color || 'black')

  useEffect(() => {
    setEdges((eds) =>
      eds.map(e => {
        if (e.id === edge.id) {
          e.data = {
            ...e.data,
            color: color,
          }
          e.markerEnd = {
            color : arrowColor, 
            type : "arrowclosed"
          }
          console.log(e)
        }
        return e
      })
    )
  }, [color, arrowColor, edge.id, setEdges])

  const handleClose = () => { 
    setEdge(null)
//    clearTimeout(window.nodeChangeTimeout)
//    window.nodeChangeTimeout= setTimeout(() => {
//      onChange('edge')
//    }, 1000)
  }

  return (
    <div className={`EdgeEditor`}>
      <label>color:</label>
      <SketchPicker
        color={ color }
        onChange={(color) => {
          setColor(color.rgb)
          setArrowColor(color.hex)
        }}
      />
      <div className="buttons">
        <button className="archButton" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}
