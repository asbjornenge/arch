import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"

// NOTE: It is possible to swap out the preview engine and get a nicer preview rendering.

const TOOLBAR_HEIGHT = 68
const FOOTER_HEIGHT = 29

export default function MarkdownEditor({ height, markdown, setMarkdown, onChange }) {
  const editorHeight = height - TOOLBAR_HEIGHT - FOOTER_HEIGHT

  const options = {
    autofocus: true,
    spellChecker: false,
    minHeight: `${editorHeight}px`,
    maxHeight: `${editorHeight}px`
  }

  const handleMarkdownChange = (md) => {
    setMarkdown(md)
    clearTimeout(window.notesChangeTimeout)
    window.notesChangeTimeout= setTimeout(() => {
      onChange('notes', md)
    }, 1000)
  }

  return (
    <SimpleMDE 
      value={markdown} 
      onChange={handleMarkdownChange} 
      options={options} 
    />
  )
}
