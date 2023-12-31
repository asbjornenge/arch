import { useState, useCallback, useEffect } from 'react'
import { ReactFlowProvider } from 'reactflow'
import styled from 'styled-components'
import ohash from 'object-hash'
import { 
  AiOutlineSave, 
  AiOutlineGithub, 
  AiOutlineSetting,
  AiOutlineFolderOpen, 
  AiOutlineCloseCircle
} from 'react-icons/ai'
import Settings from './settings.js'
import CodeEditor from './code.js'
import NotesEditor from './notes.js'
import DiagramEditor from './diagram.js'
import archLogoSvg from './graphics/logo.svg'
import { SVGIconContainerButton } from './components/SVGIconContainer'
import { 
  fileState, 
  codeState,
  TOP_HEIGHT, 
  historyState, 
  MAX_HISTORY_SHAPSHOTS, 
  WORKSPACE_HEIGHT_MARGIN
} from './state'

const getSize = () => {
  return { 
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export default function Arch() {
  const { file, setFile } = fileState() 
  const { file: codeFile, changed: codeChanged, getCode, setCodeChanged, resetCodeState } = codeState()
  const { history, addSnapshot, clearHistory } = historyState() 
  const [size, setSize] = useState(getSize())
  const [flow, setFlow] = useState(null)
  const [panning, setPanning] = useState('both')
  const [settings, setSettings] = useState({})
  const [markdown, setMarkdown] = useState('')
  const [fileHash, setFileHash] = useState('')
  const [archHash, setArchHash] = useState('')
  const [rfInstance, setRfInstance] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [historyIndex, setHistoryIndex] = useState(-1)

  const handleResize = useCallback(() => {
    let ticking = false;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setSize(getSize());
        ticking = false;
      });
      ticking = true;
    } 
  }, [])


  const getContent = useCallback(() => {
    return {
      notes: markdown,
      diagram: rfInstance ? rfInstance.toObject() : {},
      settings: settings
    }
  }, [markdown, settings, rfInstance])

  const handleOpenFile = async () => {
    const dialogConfig = {
      title: 'Select a file',
      buttonLabel: 'This one will do',
      properties: ['openFile'],
      filters: [
        { name: 'Arch file', extensions: ['arch'] },
      ]
    }
    const res = await window.electron.openDialog('showOpenDialog', dialogConfig)
    if (!res) return
    setFile(res.file)
    const content = JSON.parse(res.content)
    setMarkdown(content.notes)
    setFlow(content.diagram)
    setSettings(content.settings || {})
    setFileHash(ohash(content))
    setArchHash(ohash(content))
    clearHistory()
  }

  const handleSaveFileDialog = useCallback(async () => {
    const content = getContent()
    const dialogConfig = {
      defaultPath: '',
      payload: JSON.stringify(content)
    }
    const res = await window.electron.openDialog('showSaveDialog', dialogConfig)
    if (!res) return
    setFile(res.file)
    setFileHash(ohash(content))
  }, [getContent, setFile, setFileHash])

  const handleSaveFile = useCallback(async () => {
    if (!file) return await handleSaveFileDialog()
    const content = getContent()
    await window.electron.saveFile(file, JSON.stringify(content))
    const contentHash = ohash(content)
    setFileHash(contentHash)
    setArchHash(contentHash)
  },[file, getContent, handleSaveFileDialog])

  const handleSaveCodeFile = useCallback(async () => {
    const code = getCode()
    await window.electron.saveFile(codeFile, code)
    setCodeChanged(false)
  },[setCodeChanged, codeFile, getCode])

  const handleExternalLink = async (url) => {
    await window.electron.openExternalLink(url)
  }

  const handleCloseCodeEditor = async () => {
    resetCodeState() 
  }

  const handleChange = (prop, val) => {
    const content = getContent()
    if (prop === 'notes') {
      content.notes = val
    }
    if (prop === 'settings') {
      content.settings = val
    }
    const contentHash = ohash(content)
    const flowHash = ohash(content.diagram)
    const flowHashes = history.map(h => h.hash)
    const newFlow = flowHashes.indexOf(flowHash) < 0
    //console.log('newContent', historyIndex)
    //console.log('newContent', newContent, contentHash)
    setArchHash(contentHash)
    if (newFlow) {
      setFlow(content.diagram)
      addSnapshot({ 
        flow: content.diagram,
        hash: flowHash 
      }, historyIndex)
      setHistoryIndex(-1)
    }
  }

  const handleUndoRedo = useCallback((e) => {
    if (e.target.type === 'textarea') return
    // Undo
    if (e.keyCode === 90 && e.ctrlKey) {
      e.preventDefault()
      e.stopPropagation()
      let currentIndex = historyIndex !== -1 ? historyIndex : history.length -1
      if (currentIndex <= 0) return
      let nextIndex = currentIndex - 1
      let newState = history[nextIndex]
      setFlow(newState.flow)
      setHistoryIndex(nextIndex)
      console.log('Undo to', nextIndex, newState.hash)
    }
    // Redo
    if (e.keyCode === 89 && e.ctrlKey) {
      e.preventDefault()
      e.stopPropagation()
      let currentIndex = historyIndex !== -1 ? historyIndex : history.length -1
      if (currentIndex > MAX_HISTORY_SHAPSHOTS) return // Note we keep max 30 states?
      if (currentIndex === history.length-1) return
      let nextIndex = currentIndex + 1
      let newState = history[nextIndex]
      setFlow(newState.flow)
      setHistoryIndex(nextIndex)
      console.log('Redo to', nextIndex, newState.hash)
    } 
  }, [history, historyIndex])

  const blockReload = useCallback((e) => {
    if (e.keyCode === 82 && e.ctrlKey) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [])

  const bindSave = useCallback(async (e) => {
    if (e.keyCode === 83 && e.ctrlKey) {
      e.preventDefault()
      e.stopPropagation()
      if (!codeFile)
        await handleSaveFile()
      else
        await handleSaveCodeFile()
    }
  }, [handleSaveFile, handleSaveCodeFile, codeFile])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', blockReload)
    window.addEventListener('keydown', handleUndoRedo)
    window.addEventListener('keydown', bindSave)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', blockReload)
      window.removeEventListener('keydown', handleUndoRedo)
      window.removeEventListener('keydown', bindSave)
    }
  }, [handleResize, blockReload, handleUndoRedo, bindSave])

  let markdownWidth = size.width / 3
  if (markdownWidth < 440) markdownWidth = 440 // Smallest possible to avoid menu wrapping
  let diagramWidth = size.width - markdownWidth
  const workspaceHeight = size.height - TOP_HEIGHT - WORKSPACE_HEIGHT_MARGIN
  if (panning === 'notes') markdownWidth = size.width
  if (panning === 'diagram') {
    diagramWidth = size.width
    markdownWidth = 0
  }
  let fileName = ''
  if (file) fileName = file.split('/')[file.split('/').length-1]
  let hasDiff = archHash !== fileHash
  let fileSaver = handleSaveFile
  if (codeFile) {
    hasDiff = codeChanged
    fileName = codeFile.split('/')[codeFile.split('/').length-1]
    fileSaver = handleSaveCodeFile
  }


  return (
    <Wrapper>
      <Top>
        <TopUpper>
          <TopLeft>
            <Logo src={archLogoSvg} />
            <SVGIconContainerButton onClick={handleOpenFile} size={20}>
              <AiOutlineFolderOpen />
            </SVGIconContainerButton>
            <SVGIconContainerButton onClick={fileSaver} iconsize={17} disabled={!hasDiff}>
              <AiOutlineSave />
            </SVGIconContainerButton>
            <FileName>{fileName}</FileName>
            { codeFile &&
              <SVGIconContainerButton onClick={handleCloseCodeEditor} iconsize={17}>
                <AiOutlineCloseCircle />
              </SVGIconContainerButton>
            }
          </TopLeft>
          <PanSelector>
            <Pan selected={panning === 'notes'} onClick={() => setPanning('notes')}>{ codeFile ? 'Code' : 'Notes'}</Pan>
            <Pan selected={panning === 'both'} onClick={() => setPanning('both')}>Both</Pan>
            <Pan selected={panning === 'diagram'} onClick={() => setPanning('diagram')}>Diagram</Pan>
          </PanSelector>
          <TopRight>
            <SVGIconContainerButton onClick={() => setShowSettings(!showSettings)}>
              <AiOutlineSetting />
            </SVGIconContainerButton>
            <SVGIconContainerButton onClick={() => handleExternalLink('https://github.com/asbjornenge/arch')}>
              <AiOutlineGithub />
            </SVGIconContainerButton>
          </TopRight>
        </TopUpper>
      </Top>
      { showSettings &&
        <Settings settings={settings} setSettings={setSettings} onChange={handleChange} />
      }
      <Workspace>
        <MarkdownSpace width={markdownWidth} height={workspaceHeight} hidden={['both', 'notes'].indexOf(panning) < 0}>
          { !codeFile &&
            <NotesEditor height={workspaceHeight} markdown={markdown} setMarkdown={setMarkdown} onChange={handleChange} />
          }
          { codeFile &&
            <CodeEditor height={workspaceHeight} />
          }
        </MarkdownSpace>
        <DiagramSpace width={diagramWidth} height={workspaceHeight} hidden={['both', 'diagram'].indexOf(panning) < 0}>
          <ReactFlowProvider>
            <DiagramEditor 
              flow={flow} 
              offsetY={TOP_HEIGHT} 
              offsetX={size.width - diagramWidth} 
              settings={settings}
              onChange={handleChange} 
              notesWidth={markdownWidth}
              setRfInstance={setRfInstance}
            />
          </ReactFlowProvider>
        </DiagramSpace>
      </Workspace>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Top = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--color-border-grey);
  height: ${TOP_HEIGHT}px;
`
const TopUpper = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width: 200px;
`

const TopRight = styled.div`
  width: 200px;
  display: flex;
  justify-content: flex-end;
  gap: 5px;
`

const FileName = styled.div`
  font-size: 0.7em;
  margin-top: 4px;
`

const Logo = styled.img`
  height: 15px;
`

const Workspace = styled.div`
  display: flex;
`

const MarkdownSpace = styled.div`
  ${props => props.hidden ? 'display: none;' : ''}
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-right: 1px solid var(--color-border-grey);
`

const DiagramSpace = styled.div`
  ${props => props.hidden ? 'display: none;' : ''}
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`

const PanSelector = styled.div`
  display: flex;
  border: 1px solid var(--color-border-grey);
  border-radius: 5px;
`

const Pan = styled.div`
  padding: 5px 10px;
  width: 50px;
  text-align: center;
  color: var(--color-text-grey);
  font-size: 0.8em;
  cursor: pointer;
  user-select: none;
  background-color: ${props => props?.selected ? 'var(--color-bg-grey)': 'inherit'};
`
