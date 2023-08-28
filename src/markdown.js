import { useState } from 'react'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"

export default function MarkdownEditor({}) {
  // eslint-disable-next-line
  const [markdown, setMarkdown] = useState('# Hello')

  return (
    <SimpleMDE value={markdown} onChange={setMarkdown} />
  )
} 
