import { useState } from 'react'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"

// NOTE: It is possible to swap out the preview engine and get a nicer preview rendering.

export default function MarkdownEditor() {
  // eslint-disable-next-line
  const [markdown, setMarkdown] = useState('# Hello')

//      autofocus: true,
//      spellChecker: false,

  return (
    <SimpleMDE value={markdown} onChange={setMarkdown} />
  )
}
