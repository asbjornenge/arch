import { useMemo, useCallback, useEffect } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { ONCHANGE_TIMEOUT } from './state'
import "easymde/dist/easymde.min.css"

// NOTE: It is possible to swap out the preview engine and get a nicer preview rendering.

const TOOLBAR_HEIGHT = 68
const FOOTER_HEIGHT = 29

export default function MarkdownEditor({ height, markdown, setMarkdown, onChange }) {
  const editorHeight = height - TOOLBAR_HEIGHT - FOOTER_HEIGHT

  const saveMarkdown = useCallback(async () => {
    console.log('markdown')
    console.log('export')
    window.electron.saveMarkdown(markdown)
  }, [markdown])

  useEffect(() => {
    window.addEventListener('savemarkdown', saveMarkdown)
    return () => {
      window.removeEventListener('savemarkdown', saveMarkdown)
    }
  }, [saveMarkdown])

  const options = useMemo(() => ({
    autofocus: false,
    spellChecker: false,
    minHeight: `${editorHeight}px`,
    maxHeight: `${editorHeight}px`,
    toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen", "|", {
      name: "export",
      action: (editor) => {
        window.dispatchEvent(new CustomEvent('savemarkdown', {}))
      },
      className: "fa fa-download",
      text: "Export",
      title: "Export Button"
    }]
  }), [editorHeight])

  const handleMarkdownChange = (md) => {
    setMarkdown(md)
    clearTimeout(window.notesChangeTimeout)
    window.notesChangeTimeout = setTimeout(() => {
      onChange('notes', md)
    }, ONCHANGE_TIMEOUT)
  }

  return (
    <SimpleMDE 
      value={markdown} 
      onChange={handleMarkdownChange} 
      options={options} 
    />
  )
}
