class collisionBlock {
    constructor({ position }) {
        this.position = position
        this.height = 32
        this.width = 32
    }

    draw() {
        context.fillStyle = 'rgba(255, 0, 0, 0.5)'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
    }
}
