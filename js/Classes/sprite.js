class Sprite {
    constructor({ position, imageSrc, frameRate = 1, frameBuffer = 4, loop = true}) {
        this.position = position
        this.loaded = false;
        this.image = new Image()
        if (this.image.onload = () => {
            this.width = this.image.width / this.frameRate
            this.height = this.image.height
            this.loaded = true;
        })
        this.image.src = imageSrc
        this.frameRate = frameRate
        this.currentFrame = 0
        this.frameBuffer = frameBuffer
        this.elapsedFrames = 0
        this.loop = loop
    }

    draw() {
        if (!this.image) {
            return
        }

        const cropBox = {
            position: {
                x: this.currentFrame * this.image.width / this.frameRate,
                y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height
        }

        context.drawImage(this.image, cropBox.position.x, cropBox.position.y, cropBox.width, cropBox.height, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.updateFrames()
    }

    updateFrames() {
        this.elapsedFrames++

        if (this.elapsedFrames % this.frameBuffer == 0) {
            if (this.currentFrame < this.frameRate - 1) {
                this.currentFrame++
            }
            else {
                this.currentFrame = 0
            }
        }
    }
}