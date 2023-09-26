import Editor from '@monaco-editor/react'
import { codeState } from './state'

export default function CodeEditor({ height }) {
  const { code, language, setCode, setCodeChanged } = codeState()

  const handleCodeChange = async (code) => {
    setCode(code)
    setCodeChanged(true)
  }

  return (
    <Editor
      height={height}
      language={language.toLowerCase()}
      theme="vs-dark"
      onChange={handleCodeChange}
      value={code}
    />
  )
}