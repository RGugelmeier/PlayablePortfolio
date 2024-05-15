class Player extends Sprite {
    constructor({ position, collisionBlocks, imageSrc, frameRate, animations}) {
        super({imageSrc, frameRate})
        this.position = position
        this.velocity = {
            x: 0,
            y: 1,
        }
        
        this.collisionBlocks = SceneMan.currentScene.collisionBlocks
        this.teleRockBlocks = SceneMan.currentScene.teleRockBlocks

        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10
        }

        this.animations = animations
        this.loopAnimation = true
        this.grounded = true
        for (let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].imageSrc

            this.animations[key].image = image
        }

        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }

        this.hasDoubleJumped = false
    }

    updateCameraBox() {
        this.cameraBox = {
            position: {
                x: this.position.x - 185,
                y: this.position.y - 150,
            },
            width: 400,
            height: 300,
        }
    }

    checkForHorizontalCanvasCollision() {
        if (this.position.x + this.width + this.velocity.x >= SceneMan.currentScene.background.image.width ||
            this.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0
        }
    }

    switchSprite(key) {
        if (this.image == this.animations[key].image || !this.loaded) {
            return
        }
        this.currentFrame = 1
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
        this.loopAnimation = this.animations[key].loop
        this.currentAnimation = key
    }

    shouldPanCameraLeft({canvas, camera}) {
        const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width

        if (cameraBoxRight >= SceneMan.currentScene.background.image.width - 5) { return }

        if (cameraBoxRight >= (canvas.width) + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanCameraRight({ canvas, camera }) {
        if (this.cameraBox.position.x + this.velocity.x <= 0) {
            return
        }

        if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanCameraDown({ canvas, camera }) {
        if (this.cameraBox.position.y + this.velocity.y <= 0) {
            return
        }

        if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y
        }
    }

    shouldPanCameraUp({ canvas, camera }) {
        if (this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >= SceneMan.currentScene.background.height) {
            return
        }

        const scaledCanvasHeight = canvas.height

        if (this.cameraBox.position.y + this.cameraBox.height >= Math.abs(camera.position.y) + scaledCanvasHeight) {
            camera.position.y -= this.velocity.y
        }
    }

    update() {
        player.checkForHorizontalCanvasCollision()

        if (this.currentFrame == this.frameRate - 1) {
            if (this.loopAnimation) {
                this.updateFrames()
            }
        } else {
            this.updateFrames()
        }

        this.draw()
        //**Uncomment the below to draw the camera box for debugging purposes
        //context.fillStyle = 'rgba(0, 255, 0, 0.2)'
        //context.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height)
        this.updateCameraBox()

        this.position.x += this.velocity.x
        this.updateHitbox()
        this.checkForHorizontalCollisions()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollisions()
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 5.5,
                y: this.position.y + 10
            },
            width: 22,
            height: 20
        }
    }

    checkForHorizontalCollisions() {
        //Loop through each collision block to see if the player is colliding with any of them
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            //If colliding with a collision block
            if (
                collision({
                    obj1: this.hitbox,
                    obj2: collisionBlock
                })) {   
                //If moving right
                if (this.velocity.x > 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x = collisionBlock.position.x - offset - 0.01

                    this.isCollidingRight = true

                    break
                }

                //If moving left
                if (this.velocity.x < 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x

                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01

                    this.isCollidingLeft = true

                    break
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += gravity
        this.position.y += this.velocity.y
    }

    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            if (
                collision({
                    obj1: this.hitbox,
                    obj2: collisionBlock
                }))
                {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0

                    if (!player.grounded) {
                        player.grounded = true
                        player.switchSprite('Land')
                        if (player.hasDoubleJumped) {
                            player.hasDoubleJumped = false
                        }
                    }

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = collisionBlock.position.y - offset - 0.01

                    break
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y

                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
                    
                    break
                }
            }
        }
    }

    //Check if the player is coliding with a tele rock.
    //If they are, figure out with one.
    //This will only ever be used when a player tried to teleport, so if there is a valid teleport to be done, it will also happen by swapping the current scene depending on the teleRock's teleToScene variable
    checkForTeleRockCollision() {
        for (let i = 0; i < this.teleRockBlocks.length; i++) {
            const teleRockBlock = this.teleRockBlocks[i]

            if (
                collision({
                    obj1: this.hitbox,
                    obj2: teleRockBlock
                })) {
                if (teleRockBlock.teleToScene == 'homeScene') {
                    SceneMan.SwapScene(Scenes.homeScene)
                }
                else if ((teleRockBlock.teleToScene == 'aboutMeScene')) {
                    SceneMan.SwapScene(Scenes.aboutMeScene)
                }
                else if ((teleRockBlock.teleToScene == 'portfolioMapScene')) {
                    SceneMan.SwapScene(Scenes.portfolioMapScene)
                }
                else if ((teleRockBlock.teleToScene == 'bulletSelection')) {
                    SceneMan.SwapScene(Scenes.bulletSelection)
                }
                else if ((teleRockBlock.teleToScene == 'captisCrystali')) {
                    SceneMan.SwapScene(Scenes.captisCrystali)
                }
                else if ((teleRockBlock.teleToScene == 'flubby')) {
                    SceneMan.SwapScene(Scenes.flubby)
                }
                else if ((teleRockBlock.teleToScene == 'voidEngine')) {
                    SceneMan.SwapScene(Scenes.voidEngine)
                }
                else if ((teleRockBlock.teleToScene == 'wallRunning')) {
                    SceneMan.SwapScene(Scenes.wallRunning)
                }
                else if ((teleRockBlock.teleToScene == 'textPortfolio')) {
                    window.location.href = "https://rgugelmeier.wixsite.com/portfolio"
                }
            }
        }
    }
}
