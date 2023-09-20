import React, { useState, useEffect } from 'react'
import { 
  MdOutlineTouchApp
} from 'react-icons/md'
import { 
  AiOutlineEdit 
} from 'react-icons/ai'
import styled from 'styled-components'
import { SketchPicker } from 'react-color'
import { BiText } from 'react-icons/bi'
import { fileState } from '../state'
import './NodeEditor.css'

export default function NodeEditor({ node, setNode, setNodes, onChange, ...props }) {
  const [label, setLabel] = useState(node?.data?.label || '')
  const { file: rootFile } = fileState()
  const [file, setFile] = useState(node?.data?.file || '')
  const [notes, setNotes] = useState(node?.data?.notes || '')
  const [shape, setShape] = useState(node?.data?.shape || 'square')
  const [isGroup, setIsGroup] = useState(node?.data?.isGroup || false)
  const [fontSize, setFontSize] = useState(node?.data?.fontSize || '1em')
  const [bgColor, setBgColor] = useState(node?.data?.bgColor || 'white')
  const [fgColor, setFgColor] = useState(node?.data?.fgColor || 'black')
  const [colorWhat, setColorWhat] = useState('background')
  const [fileExists, setFileExists] = useState(true)

  useEffect(() => {
    setNodes((nds) =>
      nds.map(n => {
        if (n.id === node.id) {
          n.data = {
            ...n.data,
            file: file,
            notes: notes,
            label: label,
            shape: shape,
            isGroup: isGroup,
            bgColor: bgColor,
            fgColor: fgColor,
            fontSize: fontSize,
            fileExists: fileExists,
          }
        }
        return n
      })
    )
  }, [label, file, shape, notes, isGroup, fontSize, bgColor, fgColor, fileExists, node.id, setNodes])

  useEffect(() => {
    const checkFileExistence = async () => {
      if (!rootFile) return
      let path = rootFile.split('/')
      path.splice(-1)
      path.push(file)
      path = path.join('/')
      const res = await window.electron.fileExists(path)
      setFileExists(res)
    }
    checkFileExistence()
  }, [file, rootFile, setFileExists])

  const handleTouchFile = async () => {
    if (!rootFile) return
    let path = rootFile.split('/')
    path.splice(-1)
    path.push(file)
    path = path.join('/')
    const res = await window.electron.touchFile(path)
    setFileExists(res)
  }

  const handleEditFile = () => {}

  const handleClose = () => { 
    setNode(null)
    clearTimeout(window.nodeChangeTimeout)
    window.nodeChangeTimeout= setTimeout(() => {
      onChange('node')
    }, 1000)
  }

  return (
    <div className={`NodeEditor ${shape}`}>
      <label>label:</label>
      <input value={label} onChange={(evt) => setLabel(evt.target.value)} />
      <label>file:</label>
      <FileInputWrapper>
        <input value={file} onChange={(evt) => setFile(evt.target.value)} className={fileExists ? '' : 'error'} />
        { !fileExists &&
          <MdOutlineTouchApp onClick={handleTouchFile}  style={{ cursor: 'pointer' }} />
        }
        { fileExists &&
          <AiOutlineEdit onClick={handleEditFile}  style={{ cursor: 'pointer' }} />
        }
      </FileInputWrapper>
      <label>shape:</label>
      <ShapeSelector>
        <Shape selected={shape === 'square'} onClick={() => setShape('square')}><Square /></Shape>
        <Shape selected={shape === 'circle'} onClick={() => setShape('circle')}><Circle /></Shape>
        <Shape selected={shape === 'cylinder'} onClick={() => setShape('cylinder')}><Cylinder /></Shape>
        <Shape selected={shape === 'text'} onClick={() => setShape('text')}><Text><BiText /></Text></Shape>
      </ShapeSelector>
      <label>group:</label>
      <CheckBoxContainer>
        <input type="checkbox" checked={isGroup} onChange={(e) => setIsGroup(e.target.checked)} />
      </CheckBoxContainer>
      <label>font-size:</label>
      <input value={fontSize} onChange={(evt) => setFontSize(evt.target.value)} />
      <ColorTypeSelectContainer>
        <label>colors:</label>
        <div style={{ flex: 'auto' }}></div>
        <ColorTypeSelectLabel selected={colorWhat === 'text'} onClick={() => setColorWhat('text')}>Text</ColorTypeSelectLabel>
        <ColorTypeSelectLabel selected={colorWhat === 'background'} onClick={() => setColorWhat('background')}>Background</ColorTypeSelectLabel>
      </ColorTypeSelectContainer>
      <SketchPicker
        color={ colorWhat === 'text' ? fgColor : bgColor }
        onChange={(color) => colorWhat === 'text' ? setFgColor(color.rgb) : setBgColor(color.rgb)}
      />
      <label>notes:</label>
      <textarea value={notes} onChange={(evt) => setNotes(evt.target.value)} />
      <div className="buttons">
        <button className="archButton" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const ShapeSelector  = styled.div`
  display: flex;
  gap: 5px;
`

const Shape = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.selected ? 
  'background-color: var(--color-bg-grey);' : ''
  }
`

const Square = styled.div`
  width: 35px;
  height: 40px;
  border: 1px solid black;
  border-radius: 3px;
  background-color: white;
`

const Circle = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: white;
`

const Cylinder = styled.div`
  width: 30px;
  height: 40px;
  border: 1px solid black;
  --r: 5px;
  /* whatever values/units you want */
  background: 
    radial-gradient(50% var(--r) at 50% var(--r), var(--color-border-grey) 99.99%, #0000 0),
    radial-gradient(50% var(--r) at 50% calc(100% - var(--r)), #fff3 99.99%, #0000 0),
    white;
  border-radius: 100% / calc(var(--r) * 2);
`

const Text = styled.div`
  width: 35px;
  height: 40px;
  border: none; 
  border-radius: 3px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CheckBoxContainer = styled.div`
  display: flex;
`
const ColorTypeSelectContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 5px;
  margin-right: 5px;
`

const ColorTypeSelectLabel = styled.div`
  font-size: 0.6em;
  cursor: pointer;
  ${props => props.selected ? 'font-weight: bold;' : ''}
`
