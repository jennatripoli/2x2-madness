import { computeSquare } from './Boundary.js'

const BOXSIZE = 100
const OFFSET = 5
const RADIUS = 15

var moves = 0
var selectedGroup = null

export class Square {
    // create square with a row, column, and color
    constructor(r, c, co) {
        this.row = r
        this.column = c
        this.color = co
        this.selected = false
    }

    // move square in a direction ('up', 'down', 'left', 'right')
    move(direction) {
        if (direction == 'up') this.row -= 1
        else if (direction == 'down') this.row += 1
        else if (direction == 'left') this.column -= 1
        else if (direction == 'right') this.column += 1
    }

    // remove square by setting color to white
    remove() {
        this.color = 'white'
    }
}

export class Group {
    // create group with four squares
    constructor(s1, s2, s3, s4, s) {
        this.s1 = s1
        this.s2 = s2
        this.s3 = s3
        this.s4 = s4
        this.select(s)
    }

    // rotate group in a direction ('clockwise', 'counterclockwise')
    rotate(direction) {
        if (direction == 'clockwise') {
            this.s1.move('right')
            this.s2.move('down')
            this.s3.move('left')
            this.s4.move('up')
            moves++
            let temp = this.s1
            this.s1 = this.s4
            this.s4 = this.s3
            this.s3 = this.s2
            this.s2 = temp
        } else if (direction == 'counterclockwise') {
            this.s1.move('down')
            this.s4.move('right')
            this.s3.move('up')
            this.s2.move('left')
            moves++
            let temp = this.s1
            this.s1 = this.s2
            this.s2 = this.s3
            this.s3 = this.s4
            this.s4 = temp
        }
    }

    // return true if all squares in group are the same color
    isSameColor() {
        return (this.s1.color != 'white' && this.s1.color == this.s2.color == this.s3.color == this.s4.color)
    }

    // return true if all squares in group are removes
    isRemoved() {
        return (this.s1.color == 'white' && this.s2.color == 'white' && this.s3.color == 'white' && this.s4.color== 'white')
    }

    // remove all squares in group
    remove() {
        this.s1.remove()
        this.s2.remove()
        this.s3.remove()
        this.s4.remove()
        moves++
    }

    // determine whether to select group and/or remove it
    select(isSelected) {
        if (this.isRemoved()) selectedGroup = null
        else {
            this.selected = isSelected
            this.s1.selected = isSelected
            this.s2.selected = isSelected
            this.s3.selected = isSelected
            this.s4.selected = isSelected
            if (isSelected && this.isSameColor()) this.remove()
        }
    }
}

export class Puzzle {
    // create puzzle with rows, columns, and base squares
    constructor(nr, nc, bs) {
        this.nr = nr
        this.nc = nc
        this.bs = bs

        this.squares = []
        for (let r = 0; r < this.nr; r++) {
            this.squares[r] = [];
            for (let c = 0; c < this.nc; c++) {
                for (let s = 0; s < this.bs.length; s++) {
                    if (this.bs[s].row == r && this.bs[s].column == c) this.squares[r][c] = new Square(r, c, this.bs[s].color)
                }
                if (this.squares[r][c] == null) this.squares[r][c] = new Square(r, c, 'white')
            }
        }
    }

    // select a group based on puzzle size and mouse click coordinates
    select(nc, coordinates) {
        let centers = []
        let offsetX = (6 - nc) / 2 * BOXSIZE + OFFSET
        let sq = computeSquare(this.squares[0][0])
        for (let i = 0; i < nc - 1; i++) centers.push(sq.x + offsetX + sq.size + OFFSET + (i * BOXSIZE))

        for (let r = 0; r < centers.length; r++) {
            for (let c = 0; c < centers.length; c++) {
                if (coordinates.x > centers[c] - RADIUS && coordinates.x < centers[c] + RADIUS && coordinates.y > centers[r] - RADIUS && coordinates.y < centers[r] + RADIUS) {
                    for (let sr = 0; sr < this.nr; sr++) {
                        for (let sc = 0; sc < this.nc; sc++) {
                            this.squares[sr][sc].selected = false
                        }
                    }

                    selectedGroup = new Group(this.squares[r][c], this.squares[r][c+1], this.squares[r+1][c+1], this.squares[r+1][c], true)
                }
            }
        }
    }

    rotate(direction) {
        if (selectedGroup != null && !selectedGroup.isRemoved()) {
            let previousGroup = selectedGroup
            selectedGroup.rotate(direction)
            if (direction == 'clockwise') {
                let temp = this.squares[previousGroup.s1.row][previousGroup.s1.column]
                this.squares[previousGroup.s1.row][previousGroup.s1.column] = this.squares[previousGroup.s4.row][previousGroup.s4.column] 
                this.squares[previousGroup.s4.row][previousGroup.s4.column] = this.squares[previousGroup.s3.row][previousGroup.s3.column] 
                this.squares[previousGroup.s3.row][previousGroup.s3.column] = this.squares[previousGroup.s2.row][previousGroup.s2.column] 
                this.squares[previousGroup.s2.row][previousGroup.s2.column] = temp 
            } else if (direction == 'counterclockwise') {
                let temp = this.squares[previousGroup.s1.row][previousGroup.s1.column]
                this.squares[previousGroup.s1.row][previousGroup.s1.column] = this.squares[previousGroup.s2.row][previousGroup.s2.column] 
                this.squares[previousGroup.s2.row][previousGroup.s2.column] = this.squares[previousGroup.s3.row][previousGroup.s3.column] 
                this.squares[previousGroup.s3.row][previousGroup.s3.column] = this.squares[previousGroup.s4.row][previousGroup.s4.column] 
                this.squares[previousGroup.s4.row][previousGroup.s4.column] = temp
            }
        }
    }
}

export class Model {
    // create puzzle based on selected configuration
    constructor(configuration) {
        this.configuration = configuration
        this.nr = configuration.numRows
        this.nc = configuration.numColumns
        this.bs = configuration.baseSquares
        this.puzzle = new Puzzle(this.nr, this.nc, this.bs)
    }

    select(coordinates) { this.puzzle.select(this.nc, coordinates) }
    rotate(direction) { this.puzzle.rotate(direction) }
    getMoves() { return moves }
}