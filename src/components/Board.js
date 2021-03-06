import React, { useState } from 'react'
import propTypes from 'prop-types'

import { centeredGrid } from '../util/hexGrid'

const redHex = '#e52c3d'
const blueHex = '#655de1'
const greyHex = '#333333'
const redHexFaded = 'hsla(354, 78%, 85%, 1)'
const blueHexFaded = 'hsl(244, 69%, 85%)'
const greyHexFaded = 'hsla(0, 0%, 80%, 1)'

const Board = ({ boardData, highlightPath }) => {
  const gridSize = 11
  const svgAspectWidth = 700
  const svgAspectHeight = 500
  const [polys] = useState(centeredGrid(svgAspectWidth, svgAspectHeight, gridSize))

  // Board data has cartesian positions indexed from 1 to 11 (not zero-indexed)
  // Defaults to empty board
  boardData = boardData || {
    red: [],
    blue: []
  }

  return (
    <div style={{ display: 'grid', justifyItems: 'center', width: '85%', margin: 'auto' }}>
      <svg viewBox={[0, 0, svgAspectWidth, svgAspectHeight]}>
        {
          polys.map((poly, i) => (
            <BoardHex key={i} i={i} poly={poly} gridSize={gridSize} boardData={boardData} highlightPath={highlightPath} />
          ))
        }
      </svg>
    </div>
  )
}

const BoardHex = ({ i, poly, gridSize, boardData, highlightPath }) => {
  const { red, blue } = boardData
  const xPos = 1 + Math.floor(i / gridSize)
  const yPos = 1 + i % gridSize
  const isRed = !!red.some(({ x, y }) => x === xPos && y === yPos)
  const isBlue = !isRed && !!blue.some(({ x, y }) => x === xPos && y === yPos)
  const doFade = highlightPath && !highlightPath.some(({ x, y }) => x === xPos && y === yPos)
  const fill = !doFade
    ? isRed ? redHex : (isBlue ? blueHex : greyHex)
    : (isRed ? redHexFaded : (isBlue ? blueHexFaded : greyHexFaded))
  return (
    <polygon points={poly} style={{ fill, transition: highlightPath ? '.4s' : '.1s' }}/>
  )
}

export const transformBoardData = ({ red, blue }) => {
  return {
    red: red.map(([x, y]) => ({ x, y })),
    blue: blue.map(([x, y]) => ({ x, y }))
  }
}

export const translateBoardData = ({ red, blue }, xOffset, yOffset) => {
  return {
    red: red.map(({ x, y }) => ({ x: x + xOffset, y: y + yOffset })),
    blue: blue.map(({ x, y }) => ({ x: x + xOffset, y: y + yOffset }))
  }
}

// Show only the checkers placed before turnNum (turnNum starts at 0)
export const boardAtTurn = ({ red, blue }, turnNum) => {
  const redNum = Math.floor((turnNum + 1) / 2)
  const blueNum = Math.floor((turnNum + 1) / 2 - 0.5)
  return {
    red: red.filter((_, i) => i < redNum),
    blue: blue.filter((_, i) => i < blueNum)
  }
}

Board.propTypes = {
  boardData: propTypes.object,
  highlightPath: propTypes.array
}

BoardHex.propTypes = {
  i: propTypes.number,
  gridSize: propTypes.number,
  poly: propTypes.array,
  boardData: propTypes.object,
  highlightPath: propTypes.array
}

export default Board
