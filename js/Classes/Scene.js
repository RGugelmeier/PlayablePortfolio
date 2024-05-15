class Scene {
    constructor({ bgImage_, startPos_, collisionData_, collisionColumns_, cameraStart_ }) {
        //Set initial data
        /* bgImage: The image that will render in the background
         * startPos: The position the player will be put to when swapping scenes
         * collisionData: The name of the const from "collisionData.js" that the scene will use.
         * collisionRows_: The amount of columns the scene has to be slices by to palce collison blocks properly
         */
        this.bgImage = bgImage_
        this.startPos = startPos_
        this.collisionData = collisionData_
        this.collisionColumns = collisionColumns_
        this.cameraStart = cameraStart_

        //Create 2D arrays for collision data
        /* groundCollisions2D: Collision blocks the player will not be able to move through
         * grappleCollisions2D: Determines where the player will be able to grapple from
         * teleRockCollisions2D: Determies where the teleRocks are located so the player can use them when collided with them
         */
        this.groundCollisions2D = []
        this.grappleCollisions2D = []
        this.teleRockCollisions2D = []

        //Holds all of the collision block objects. See collisionBlocks.js for info on collision blocks
        this.collisionBlocks = []
        this.grappleBlocks = []
        this.teleRockBlocks = []

        //Create the background sprite object to use for the scene
        this.background = new Sprite({
            position: {
                x: 0,
                y: 0,
            },
            imageSrc: this.bgImage
        })

        //Set the starting position of the camera for the new scene.
        //camera.position = { x: this.cameraStart.x, y: this.cameraStart.y }
    }

    //This function will be called by SceneManager when the scene has been swapped
    StartScene() {
        //The number that represents collision blocks in the map data sets.
        const COLLISION_BLOCK_SYMBOL = 1282

        this.grappleCollisions2D = []
        this.teleRockCollisions2D = []

        this.collisionBlocks = []
        this.grappleBlocks = []
        this.teleRockBlocks = []
        
        //Loop through the collisionData passed in as collisionData_'s groundCollisions,
        //then separate each row into it's own array, pushing that array into the 2D array for all ground collisions
        for (let i = 0; i < this.collisionData.groundCollisions.length; i += this.collisionColumns) {
            this.groundCollisions2D.push(this.collisionData.groundCollisions.slice(i, i + this.collisionColumns))
        }

        //Loop through each object in the 2D ground collisions array, finding each collision block (determined by it's number being 1282), and push it to collision blocks array
        this.groundCollisions2D.forEach((row, y) => {
            row.forEach((symbol, x) => {
                if (symbol == COLLISION_BLOCK_SYMBOL) {
                    this.collisionBlocks.push(new collisionBlock({
                        position: {
                            x: x * 32,
                            y: y * 32,
                        },
                    })
                    )
                }
            })
        })

        //Loop through the collisionData passed in as collisionData_'s grappleCollisions,
        //then separate each row into it's own array, pushing that array into the 2D array for all grapple collisions
        if (this.collisionData.grappleCollision) {
            for (let i = 0; i < this.collisionData.grappleCollision.length; i += this.collisionColumns) {
                this.grappleCollisions2D.push(this.collisionData.grappleCollision.slice(i, i + this.collisionColumns)) //TODO The amount that is sliced by needs to be dynamic, because each collision data set has a different amount of blocks in a row
            }
        }

        //Loop through each object in the 2D grapple collisions array, finding each collision block (determined by it's number being 1282), and push it to collision blocks array
        this.grappleCollisions2D.forEach((row, y) => {
            row.forEach((symbol, x) => {
                if (symbol == COLLISION_BLOCK_SYMBOL) {
                    this.grappleBlocks.push(new collisionBlock({
                        position: {
                            x: x * 32,
                            y: y * 32,
                        },
                    })
                    )
                }
            })
        })

        //Loop through the collisionData passed in as collisionData_'s teleRockCollisions,
        //then separate each row into it's own array, pushing that array into the 2D array for all tele rock collisions
        for (let i = 0; i < this.collisionData.teleRockCollisions.length; i += this.collisionColumns) {
            this.teleRockCollisions2D.push(this.collisionData.teleRockCollisions.slice(i, i + this.collisionColumns))
        }

        //Loop through each object in the 2D tele rock collisions array, finding each teleRock block (determined by it's value being a string), and push it to teleRock blocks array
        this.teleRockCollisions2D.forEach((row, y) => {
            row.forEach((symbol, x) => {
                if (typeof symbol == "string") {
                    this.teleRockBlocks.push(new teleRockBlock({
                        position_: {
                            x: x * 32,
                            y: y * 32,
                        },
                        teleToScene_: symbol
                    })
                    )
                }
            })
        })
    }

    //Update the scene
    Update() {
        this.background.update()
    }
}