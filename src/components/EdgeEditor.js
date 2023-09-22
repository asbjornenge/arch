import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { SketchPicker } from 'react-color'
import './EdgeEditor.css'

export default function EdgeEditor({ edge, setEdge, setEdges, onChange, ...props }) {
  const [label, setLabel] = useState(edge?.data?.label || '')
  const [color, setColor] = useState(edge?.data?.color || 'black')
  const [fontSize, setFontSize] = useState(edge?.data?.fontSize || '1em')

  useEffect(() => {
    setEdges((eds) =>
      eds.map(e => {
        if (e.id === edge.id) {
          e.data = {
            ...e.data,
            label: label,
            color: color,
            fontSize: fontSize
          }
        }
        return e
      })
    )
  }, [label, fontSize, color, edge.id, setEdges])

//  useEffect(() => {
//    const checkFileExistence = async () => {
//      if (!rootFile) return
//      let path = rootFile.split('/')
//      path.splice(-1)
//      path.push(file)
//      path = path.join('/')
//      const res = await window.electron.fileExists(path)
//      setFileExists(res)
//    }
//    checkFileExistence()
//  }, [file, rootFile, setFileExists])

  const handleClose = () => { 
    setEdge(null)
//    clearTimeout(window.nodeChangeTimeout)
//    window.nodeChangeTimeout= setTimeout(() => {
//      onChange('edge')
//    }, 1000)
  }

  return (
    <div className={`EdgeEditor`}>
      <label>label:</label>
      <input value={label} onChange={(evt) => setLabel(evt.target.value)} />
      <label>font-size:</label>
      <input value={fontSize} onChange={(evt) => setFontSize(evt.target.value)} />
      <label>color:</label>
      <SketchPicker
        color={ color }
        onChange={(color) => setColor(color.rgb)}
      />
      <div className="buttons">
        <button className="archButton" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}
