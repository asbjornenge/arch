import { useState } from 'react'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"

// NOTE: It is possible to swap out the preview engine and get a nicer preview rendering.

const TOOLBAR_HEIGHT = 68
const FOOTER_HEIGHT = 29

export default function MarkdownEditor({ height, data }) {
  const [markdown, setMarkdown] = useState(data?.nodes)
  const editorHeight = height - TOOLBAR_HEIGHT - FOOTER_HEIGHT

  const options = {
      autofocus: true,
      spellChecker: false,
      minHeight: `${editorHeight}px`,
      maxHeight: `${editorHeight}px`
    }

  return (
    <SimpleMDE 
      value={markdown} 
      onChange={setMarkdown} 
      options={options} 
    />
  )
}
