const BOXSIZE = 100
const OFFSET = 5
const RADIUS = 15

export class SquareCalc {
    // create a square with position and size
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
    }
}

export function computeSquare(square) {
    return new SquareCalc(BOXSIZE * square.column + OFFSET, BOXSIZE * square.row + OFFSET, BOXSIZE - 2 * OFFSET)
}

// redraw entire canvas from model
export function redrawCanvas(model, canvasObj) {
    const ctx = canvasObj.getContext('2d')
    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height)

    let nr = model.puzzle.nr
    let nc = model.puzzle.nc
    let offsetX = (6 - nc) / 2 * BOXSIZE + OFFSET
    let offsetY = (6 - nr) / 2 * BOXSIZE + OFFSET

    for (let r = 0; r < nr; r++) {
        for (let c = 0; c < nc; c++) {
            let sq = computeSquare(model.puzzle.squares[r][c])

            if (model.puzzle.squares[r][c].selected) {
                ctx.fillStyle = 'darkred'
                ctx.fillRect(sq.x + offsetX - OFFSET*2, sq.y + offsetY - OFFSET*2, sq.size + OFFSET*4, sq.size + OFFSET*4)
            }

            ctx.fillStyle = model.puzzle.squares[r][c].color
            ctx.fillRect(sq.x + offsetX, sq.y + offsetY, sq.size, sq.size)
            ctx.fillStyle = 'black'
            ctx.strokeRect(sq.x + offsetX, sq.y + offsetY, sq.size, sq.size)
        }
    }

    for (let r = 0; r < nr; r++) {
        for (let c = 0; c < nc; c++) {
            if (r < nr - 1 && c < nc - 1) {
                let sq = computeSquare(model.puzzle.squares[r][c])
                ctx.beginPath()
                ctx.fillStyle = 'black'
                ctx.arc(sq.x + offsetX + sq.size + OFFSET, sq.y + offsetY + sq.size + OFFSET, RADIUS*1.1, 0, 2 * Math.PI, false)
                ctx.fill()
                ctx.closePath()

                if (model.puzzle.squares[r][c].selected && model.puzzle.squares[r][c+1].selected && model.puzzle.squares[r+1][c].selected && model.puzzle.squares[r+1][c+1].selected) {
                    ctx.fillStyle = 'darkred'
                } else ctx.fillStyle = 'white'

                ctx.beginPath()
                ctx.arc(sq.x + offsetX + sq.size + OFFSET, sq.y + offsetY + sq.size + OFFSET, RADIUS, 0, 2 * Math.PI, false)
                ctx.fill()
            }
        }
    }

    if (model.victory()) {
        ctx.fillStyle = 'darkslateblue'
        ctx.fillRect(0, 0, canvasObj.width, canvasObj.height)

        ctx.font = 'bold 4em Courier New, monospace'
        let text1Height = ctx.measureText('M').width
        ctx.font = '2em Courier New, monospace'
        let text2Height = ctx.measureText('M').width

        ctx.fillStyle = 'white'
        ctx.font = 'bold 4em Courier New, monospace'
        let text = 'You Win!'
        ctx.fillText(text, (canvasObj.width / 2) - (ctx.measureText(text).width / 2), 
        ((canvasObj.height / 2) - ((text1Height + text2Height) / 2)))

        ctx.font = '2em Courier New, monospace'
        text = 'Solved in ' + model.getVictoryMoves() + " moves."
        ctx.fillText(text, (canvasObj.width / 2) - (ctx.measureText(text).width / 2),
        ((canvasObj.height/2) - ((text1Height + text2Height) / 2) + text1Height))
    }
}