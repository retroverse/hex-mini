import React, { useState, useEffect } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import propTypes from 'prop-types'

const calcGameLength = board =>
  board.red.length + board.blue.length

const TurnControls = ({ boardData, onTurnChange, disabled = false }) => {
  const [currentTurn, setCurrentTurn] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const playInterval = 100

  // Provide default for board data
  boardData = boardData || { red: [], blue: [] }

  // Set turn to last turn on round change / load
  useEffect(() => {
    const newTurn = calcGameLength(boardData)
    setCurrentTurn(newTurn)
    onTurnChange(newTurn)
  }, [boardData, onTurnChange])

  const handleTurnChange = turn => {
    const gameLength = calcGameLength(boardData)
    const newTurn = Math.max(Math.min(gameLength, turn), 0)
    setCurrentTurn(newTurn)
    onTurnChange(newTurn)
  }

  const handlePlayOrPause = () => {
    if (!isPlaying) {
      const gameLength = calcGameLength(boardData)
      if (currentTurn >= gameLength) {
        handleTurnChange(0)
      }
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    const int = setInterval(() => {
      if (isPlaying) {
        const gameLength = calcGameLength(boardData)
        if (currentTurn >= gameLength) {
          setIsPlaying(false)
        } else {
          handleTurnChange(currentTurn + 1)
        }
      }
    }, playInterval)
    return () => clearInterval(int)
  })

  const gameLength = calcGameLength(boardData)

  return (
    <span style={{ marginLeft: '10px' }}>
      <Button
        icon
        onClick={_ => handleTurnChange(0)}
        disabled={disabled || currentTurn === 0}
      > <Icon name='angle double left' /> </Button>
      <Button
        icon
        onClick={_ => handleTurnChange(currentTurn - 1)}
        disabled={disabled || isPlaying || currentTurn === 0}
      > <Icon name='angle left' /> </Button>
      <Button
        icon
        onClick={handlePlayOrPause}
        disabled={disabled}
      > {isPlaying
          ? <Icon name='pause' />
          : <Icon name='play' />
        } </Button>
      <Button
        icon
        onClick={_ => handleTurnChange(currentTurn + 1)}
        disabled={disabled || isPlaying || currentTurn === gameLength}
      > <Icon name='angle right' /> </Button>
      <Button
        icon
        onClick={_ => handleTurnChange(121)}
        disabled={disabled || currentTurn === gameLength}
      > <Icon name='angle double right' /> </Button>
    </span>
  )
}

TurnControls.propTypes = {
  boardData: propTypes.object,
  onTurnChange: propTypes.func,
  disabled: propTypes.bool
}

export default TurnControls
