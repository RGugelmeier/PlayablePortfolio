class Controller {
    constructor() {
        this.keys = {
            d: {
                pressed: false
            },
            a: {
                pressed: false
            },
            w: {
                pressed: false
            },
            space: {
                pressed: false
            },
            shift: {
                pressed: false
            }
        }

        /*Start listening for new key presses.
         * If d is pressed, set keys.d to be pressed, which will make the player move right in controller's Update() seen below. 
         * Same with a for moving the player left.
         * If the player presses space (' ') make the player jump and set the player's grounded to false. This will reset when the player colides with a block beneath it.
         * */
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'd':
                    this.keys.d.pressed = true
                    if (player.isCollidingLeft) {
                        player.isCollidingLeft = false
                    }
                    break
                case 'a':
                    this.keys.a.pressed = true
                    if (player.isCollidingRight) {
                        player.isCollidingRight = false
                    }
                    break
                case 'w':
                    this.keys.w.pressed = true
                    break
                case ' ':
                    this.keys.space.pressed = true
                    //Check if the player is on the ground. If they are, make the player jump and set grounded to false so they can only jump again when they are on the ground again.
                    if (player.grounded) {
                        player.switchSprite('Jump')
                        player.velocity.y = -10
                        player.grounded = false
                    }
                    //If the player has not yet double jumped...
                    else if (!player.hasDoubleJumped)
                    {
                        //allow the player to jump again
                        player.velocity.y = -10
                        player.hasDoubleJumped = true
                    }
                    //If the player has jumped and double jumped already, see if they can wall jump. If not, nothing will happen.
                    else {
                        if (player.isCollidingLeft) {
                            player.velocity.x = 8
                            player.velocity.y = -8
                            player.isCollidingLeft = false
                        }
                        else if (player.isCollidingRight) {
                            player.velocity.x = -8
                            player.velocity.y = -8
                            player.isCollidingRight = false
                        }
                    }
                    break
            }
        })

        /*Start listening for key up events to set pressed for the respective keys to false
         * This will stop the player from moving
         */
        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'd':
                    this.keys.d.pressed = false
                    break
                case 'a':
                    this.keys.a.pressed = false
                    break
                case 'w':
                    this.keys.w.pressed = false
                    break
                case ' ':
                    this.keys.space.pressed = false
            }
        })

        this.isGrappling = false
        this.grappleBlock = null
        this.angle = 0
        this.angleVelocity = 0
        this.gravity = 0.1 // adjust this value to change the gravity effect
        this.distance = 0

        window.addEventListener('mousedown', (event) => {
            if (event.button === 0) { // left mouse button

                const grappleBlocks = SceneMan.currentScene.grappleBlocks // assume this function returns an array of grapple blocks
                for (const block of grappleBlocks) {
                    const distance = Math.sqrt(Math.pow(player.position.x - block.position.x, 2) + Math.pow(player.position.y - block.position.y, 2))
                    if (distance <= 100) { // adjust this value to change the grapple range
                        this.isGrappling = true
                        this.grappleBlock = block
                        this.distance = distance
                        const dx = player.position.x - block.position.x
                        const dy = player.position.y - block.position.y
                        this.angle = Math.atan2(dy, dx) - Math.PI / 2
                        this.angleVelocity = player.velocity.x * 0.01 // adjust this value to change the initial swing speed
                        break
                    }
                }
            }
        });

        window.addEventListener('mouseup', (event) => {
            if (event.button === 0) { // left mouse button
                // Update the player's velocity to keep the momentum of their swing
                if (this.isGrappling) {
                    this.isGrappling = false
                    this.grappleBlock = null

                    if (player.hasDoubleJumped) {
                        player.hasDoubleJumped = false
                    }
                }
            }
        });

    }

    //Check to see if the player or the camera needs to be moved
    Update() {
        if (this.keys.d.pressed) {
            player.velocity.x = 4
            player.shouldPanCameraLeft({ canvas, camera })
        }
        else if (this.keys.a.pressed) {
            player.velocity.x = -4
            player.shouldPanCameraRight({ canvas, camera })
        }
        else if (!this.keys.d.pressed && !this.keys.a.pressed) {
            player.velocity.x = 0
        }

        if (player.velocity.y < 0) {
            player.shouldPanCameraDown({ canvas, camera })
        }
        else if (player.velocity.y > 0) {
            player.shouldPanCameraUp({ camera, canvas })
        }

        if (this.keys.w.pressed) {
            player.checkForTeleRockCollision()
        }

        if (this.isGrappling && this.grappleBlock) {
            // Update the angle velocity based on gravity
            this.angleVelocity += -this.gravity * Math.sin(this.angle)

            this.angleVelocity /= 1.01

            // Check if the player is pressing 'd' or 'a'
            if (this.keys.d.pressed) {
                this.angleVelocity -= 0.02
            } else if (this.keys.a.pressed) {
                this.angleVelocity += 0.02
            }

            // Update the angle based on the angle velocity
            this.angle += this.angleVelocity * 0.1

            // Calculate the player's position relative to the grapple block
            const dx = Math.cos(this.angle + Math.PI / 2) * this.distance
            const dy = Math.sin(this.angle + Math.PI / 2) * this.distance
            player.position.x = this.grappleBlock.position.x + dx
            player.position.y = this.grappleBlock.position.y + dy

            // Set the player's velocity to zero, so they don't move away from the grapple block
            player.velocity.x = 0
            player.velocity.y = 0
        }
    }
}