export function select(model, coordinates, scale) {
    model.select(coordinates, scale)
    return model
}

export function rotate(model, direction) {
    model.rotate(direction)
    return model
}