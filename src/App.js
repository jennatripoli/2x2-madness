import React from 'react'
import './App.css'
import { config_4x4, config_5x5, config_6x6 } from './configs.js'
import { redrawCanvas } from './Boundary.js'
import { Model } from './Model.js'
import { select, rotate } from './Controller.js'
import { layout } from './Layout.js'

export let currentConfiguration = 4

function App() {
  const [model, setModel] = React.useState(new Model(config_4x4))
  const canvasRef = React.useRef(null)

  // request redraw after model change
  const [redraw, forceRedraw] = React.useState(0)

  // initial rendering is performed, and when model changes, it is re-rendered
  React.useEffect(() => {redrawCanvas(model, canvasRef.current)}, [model, redraw])

  // select configuration, reset configuration, and request redraw
  const resetConfigurationController = (configuration) => {
    let newModel = null
    if (configuration == 4) newModel = new Model(config_4x4)
    else if (configuration == 5) newModel = new Model(config_5x5)
    else if (configuration == 6) newModel = new Model(config_6x6)
    currentConfiguration = configuration
    newModel.setMoves(0)
    newModel.setRemoved(0)
    newModel.setVictoryMoves(0)
    setModel(newModel)
    forceRedraw(redraw + 1)
  }

  // select a group and request redraw
  const selectGroupController = (e) => {
    let rect = canvasRef.current.getBoundingClientRect()
    let coordinates = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    let newModel = select(model, coordinates, canvasRef.current.getBoundingClientRect().width / 610)
    setModel(newModel)
    forceRedraw(redraw + 1)
  }

  // rotate a group and request redraw
  const rotateGroupController = (direction) => {
    let newModel = rotate(model, direction)
    setModel(newModel)
    forceRedraw(redraw + 1)
  }

  return (
    <div data-testid='app' className='AppRef'>
      <div style={layout.center}>
        <label style={layout.title}>2x2 Madness</label>
        <label style={layout.subtitle}>Rotate groups of four squares to create groups of the same color. Select a group (by clicking on the center circle) to choose it for rotation or remove it when complete.<b> Remove all colors to win!</b></label>
        <canvas data-testid='canvas' style={layout.puzzle} tabIndex='-1' className='App-canvas' ref={canvasRef} onClick={selectGroupController} width='610' height='610'/>
      </div>
      <div style={layout.left}>
        <label style={layout.configurationTitle}>Configuration</label>
        <button data-testid='4x4' className="button" style={layout.configurationButton} onClick={(e) => resetConfigurationController(4)}>4x4</button>
        <button data-testid='5x5' className="button" style={layout.configurationButton} onClick={(e) => resetConfigurationController(5)}>5x5</button>
        <button data-testid='6x6' className="button" style={layout.configurationButton} onClick={(e) => resetConfigurationController(6)}>6x6</button>
        <button data-testid='reset' className="button" style={layout.resetButton} onClick={(e) => resetConfigurationController(currentConfiguration)}>Reset</button>
      </div>
      <div style={layout.right}>
        <label style={layout.movesTitle}>Move Count</label>
        <label style={layout.movesCount}>{model.getMoves()}</label>
        <div style={layout.rotateButtons}>
          <button data-testid='rotateCW' className="button" style={layout.rotateButton} onClick={(e) => rotateGroupController('clockwise')}><svg xmlns="http://www.w3.org/2000/svg" height='4vw' viewBox="0 0 512 512"><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/></svg></button>
          <button data-testid='rotateCCW' className="button" style={layout.rotateButton} onClick={(e) => rotateGroupController('counterclockwise')}><svg xmlns="http://www.w3.org/2000/svg" height='4vw' viewBox="0 0 512 512"><path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/></svg></button>
        </div>
      </div>
    </div>    
  );
}

export default App;
