import { render, screen, fireEvent } from '@testing-library/react'
import { Model, Group } from './Model.js'
import { select, rotate } from './Controller.js'
import { config_4x4 } from './configs.js'
import { currentConfiguration } from './App.js'
import { redrawCanvas } from './Boundary.js'
import App from './App.js'

test('Access GUI', () => {
  const { app } = render(<App />)
  const rotateCWButton = screen.getByTestId('rotateCW')
  const rotateCCWButton = screen.getByTestId('rotateCCW')

  expect(rotateCWButton.disabled).toBeFalsy()
  fireEvent.click(rotateCWButton)
  expect(rotateCCWButton.disabled).toBeFalsy()
  fireEvent.click(rotateCCWButton)
});

test('No moves when model created', () => {
  var model = new Model(config_4x4)
  expect(model.moves).toBe(undefined)
});

test('Reset and set configurations', () => {
  const { app } = render(<App />)
  const canvasElement = screen.getByTestId('canvas')
  const x4Button = screen.getByTestId('4x4')
  const x5Button = screen.getByTestId('5x5')
  const x6Button = screen.getByTestId('6x6')
  const resetButton = screen.getByTestId('reset')

  let model = new Model(config_4x4)
  model.setMoves(0)
  expect(model.getMoves()).toBe(0)

  fireEvent.click(resetButton)
  expect(currentConfiguration).toBe(4)
  expect(model.getMoves()).toBe(0)
  redrawCanvas(model, canvasElement)

  fireEvent.click(x4Button)
  expect(currentConfiguration).toBe(4)
  expect(model.getMoves()).toBe(0)
  redrawCanvas(model, canvasElement)

  fireEvent.click(resetButton)
  expect(currentConfiguration).toBe(4)
  expect(model.getMoves()).toBe(0)
  redrawCanvas(model, canvasElement)

  fireEvent.click(x5Button)
  expect(currentConfiguration).toBe(5)
  expect(model.getMoves()).toBe(0)
  redrawCanvas(model, canvasElement)

  fireEvent.click(x6Button)
  expect(currentConfiguration).toBe(6)
  expect(model.getMoves()).toBe(0)
  redrawCanvas(model, canvasElement)
});

test('Select group', () => {
  const { app } = render(<App />)
  const canvasElement = screen.getByTestId('canvas')

  let model = new Model(config_4x4)
  expect(model.getMoves()).toBe(0)

  model.select({ x: 205, y: 205 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(new Group(
    model.puzzle.squares[0][0], model.puzzle.squares[0][1],
    model.puzzle.squares[1][1], model.puzzle.squares[1][0], true))
  expect(model.getMoves()).toBe(0)
});

test('Rotate group (cw + ccw)', () => {
  const { app } = render(<App />)
  const canvasElement = screen.getByTestId('canvas')

  let model = new Model(config_4x4)
  model.setMoves(0)
  expect(model.getMoves()).toBe(0)

  select(model, { x: 305, y: 305 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(new Group(
    model.puzzle.squares[1][1], model.puzzle.squares[1][2],
    model.puzzle.squares[2][2], model.puzzle.squares[2][1], true))
  redrawCanvas(model, canvasElement)

  rotate(model, 'clockwise')
  expect(model.getSelectedGroup()).toStrictEqual(new Group(
    model.puzzle.squares[1][1], model.puzzle.squares[1][2],
    model.puzzle.squares[2][2], model.puzzle.squares[2][1], true))
  expect(model.getMoves()).toBe(1)
  redrawCanvas(model, canvasElement)

  select(model, { x: 405, y: 405 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(new Group(
    model.puzzle.squares[2][2], model.puzzle.squares[2][3],
    model.puzzle.squares[3][3], model.puzzle.squares[3][2], true))
  redrawCanvas(model, canvasElement)

  rotate(model, 'counterclockwise')
  expect(model.getSelectedGroup()).toStrictEqual(new Group(
    model.puzzle.squares[2][2], model.puzzle.squares[2][3],
    model.puzzle.squares[3][3], model.puzzle.squares[3][2], true))
  expect(model.getMoves()).toBe(2)
  redrawCanvas(model, canvasElement)
});

test('Remove group', () => {
  const { app } = render(<App />)
  const canvasElement = screen.getByTestId('canvas')

  let model = new Model(config_4x4)
  model.setMoves(0)
  model.setRemoved(0)
  expect(model.getMoves()).toBe(0)
  expect(model.getRemoved()).toBe(0)

  select(model, { x: 205, y: 205 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(new Group(
    model.puzzle.squares[0][0], model.puzzle.squares[0][1],
    model.puzzle.squares[1][1], model.puzzle.squares[1][0], true))
  redrawCanvas(model, canvasElement)

  rotate(model, 'counterclockwise')
  expect(model.getSelectedGroup()).toStrictEqual(new Group(
    model.puzzle.squares[0][0], model.puzzle.squares[0][1],
    model.puzzle.squares[1][1], model.puzzle.squares[1][0], true))
  expect(model.getMoves()).toBe(1)
  redrawCanvas(model, canvasElement)

  select(model, { x: 205, y: 405 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(new Group(
    model.puzzle.squares[2][0], model.puzzle.squares[2][1],
    model.puzzle.squares[3][1], model.puzzle.squares[3][0], true))
  redrawCanvas(model, canvasElement)

  rotate(model, 'clockwise')
  expect(model.getSelectedGroup()).toStrictEqual(new Group(
    model.puzzle.squares[2][0], model.puzzle.squares[2][1],
    model.puzzle.squares[3][1], model.puzzle.squares[3][0], true))
  expect(model.getMoves()).toBe(2)
  redrawCanvas(model, canvasElement)

  select(model, { x: 205, y: 305 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(null)
  expect(model.getMoves()).toBe(3)
  expect(model.getRemoved()).toBe(4)
  redrawCanvas(model, canvasElement)
});

test('Win game', () => {
  const { app } = render(<App />)
  const canvasElement = screen.getByTestId('canvas')

  let model = new Model(config_4x4)
  model.setMoves(0)
  model.setRemoved(0)

  expect(model.getVictoryMoves()).toBe(0)
  expect(model.getRemoved()).toBe(0)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 205, y: 205 }, 1)
  rotate(model, 'counterclockwise')
  expect(model.getMoves()).toBe(1)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 205, y: 405 }, 1)
  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(2)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 205, y: 305 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(null)
  expect(model.getMoves()).toBe(3)
  expect(model.getRemoved()).toBe(4)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 405, y: 205 }, 1)
  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(4)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 405, y: 405 }, 1)
  rotate(model, 'counterclockwise')
  expect(model.getMoves()).toBe(5)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 405, y: 305 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(null)
  expect(model.getMoves()).toBe(6)
  expect(model.getRemoved()).toBe(8)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 405, y: 405 }, 1)
  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(7)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 405, y: 205 }, 1)
  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(8)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(9)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 205, y: 205 }, 1)
  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(10)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 205, y: 405 }, 1)
  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(11)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(12)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 305, y: 305 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(null)
  expect(model.getMoves()).toBe(13)
  expect(model.getRemoved()).toBe(12)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 305, y: 205 }, 1)
  rotate(model, 'counterclockwise')
  expect(model.getMoves()).toBe(14)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 405, y: 305 }, 1)
  rotate(model, 'counterclockwise')
  expect(model.getMoves()).toBe(15)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 405, y: 405 }, 1)
  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(16)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 205, y: 405 }, 1)
  rotate(model, 'clockwise')
  expect(model.getMoves()).toBe(17)
  expect(model.victory()).toBe(false)
  redrawCanvas(model, canvasElement)

  select(model, { x: 305, y: 305 }, 1)
  expect(model.getSelectedGroup()).toStrictEqual(null)
  expect(model.getMoves()).toBe(18)
  expect(model.getRemoved()).toBe(16)
  redrawCanvas(model, canvasElement)

  expect(model.victory()).toBe(true)
  expect(model.getVictoryMoves()).toBe(18)
  redrawCanvas(model, canvasElement)
});
