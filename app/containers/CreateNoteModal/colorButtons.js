import React from 'react'
import Paper from 'material-ui/Paper'
import ActionDone from 'material-ui/svg-icons/action/done'
import colorHex from './colorHex'

const colorArray = ['DEFAULT', 'RED', 'ORANGE', 'YELLOW', 'GRAY', 'BLUE', 'TEAL', 'GREEN']

const colorDataTip = color => {
  if (color) {
    if (color === 'DEFAULT') {
      return 'white'
    }
    return color.toLowerCase()
  }
  return null
}

const colorCheckMark = (color, colorState) => {
  if (colorState) {
    if (colorState === color) {
      return (
        <ActionDone />
      )
    } else if (colorState === 'DEFAULT' && color === 'WHITE') {
      return (
        <ActionDone />
      )
    }
  } else if (color === 'WHITE') {
    return (
      <ActionDone />
    )
  } else {
    return null
  }
}

export default (setStateFunction, colorState) => (
  colorArray.map(color => (
    <Paper
      circle
      key={`${color}-DIALOG`}
      data-tip={colorDataTip(color)}
      onClick={() => setStateFunction(color)}
      style={{
        backgroundColor: colorHex(color).code,
        height: '25px',
        width: '25px',
        display: 'inline-block',
        margin: '3px',
        cursor: 'pointer',
        verticalAlign: 'top'
      }}
    >
      {colorCheckMark(color, colorState)}
    </Paper>
  ))
)
