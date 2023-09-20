import styled from 'styled-components'
import { 
  TOP_HEIGHT, 
  ONCHANGE_TIMEOUT
} from './state'

export default function Settings({ settings, setSettings, onChange }) {

  const handleSettings = async (key, value) => {
    let update = {}
    update[key] = value
    let updatedSettings = Object.assign({}, settings, update)
    setSettings(updatedSettings) 
    clearTimeout(window.settingsChangeTimeout)
    window.settingsChangeTimeout = setTimeout(() => {
      onChange('settings', updatedSettings)
    }, ONCHANGE_TIMEOUT)
  }

  return (
    <Wrapper>
      <label>Snap-to-grid:</label>
      <input type="checkbox" checked={settings?.snapToGrid} onChange={(e) => handleSettings('snapToGrid', e.target.checked)} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0px;
  top: ${TOP_HEIGHT}px;
  background-color: var(--color-bg-dark-grey);
  border: 1px solid var(--color-border-grey);
  align-items: flex-start;
  padding: 10px;
  z-index: 1001;
  & label {
    font-size: 0.8em;
    user-select: none;
  }
  & input[type="checkbox"] {
    cursor: pointer;
  }
`
