import { codeState } from './state'

export default function CodeEditor({ height }) {
  const { code, language } = codeState()

  return (
    <div>{code+language}</div>
  )
}
