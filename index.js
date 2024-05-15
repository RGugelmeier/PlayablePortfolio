const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
const scaledCanvas = {
    width: canvas.width / 2,
    height: canvas.height / 2
}
const gravity = 0.5
const perfectTimeframe = 1000/60
let deltaTime = 0
let lastTimestamp = 0


//An object that holds each scene. Used by the scene manager to know what scene to swap to or update.
const Scenes = {
    homeScene: new Scene({
        bgImage_: './images/Backgrounds/PlayablePortfolio.png',
        startPos_: { x: 150, y: 0 },
        collisionData_: landingCollisions,
        collisionColumns_: 48,
        cameraStart_: {x: 0, y: -175}
    }),
    aboutMeScene: new Scene({
        bgImage_: './images/Backgrounds/AboutMe.png',
        startPos_: { x: 150, y: 300 },
        collisionData_: aboutMeCollisions,
        collisionColumns_: 72,
        cameraStart_: { x: 0, y: -175 }
    }),
    portfolioMapScene: new Scene({
        bgImage_: './images/Backgrounds/Portfolio.png',
        startPos_: { x: 150, y: 300 },
        collisionData_: portfolioMapCollisions,
        collisionColumns_: 52,
        cameraStart_: { x: 0, y: -175 }
    }),
    voidEngine: new Scene({
        bgImage_: './images/Backgrounds/VOIDEngine.png',
        startPos_: { x: 150, y: 300 },
        collisionData_: projectMapCollisions,
        collisionColumns_: 45,
        cameraStart_: { x: 0, y: -175 }
    }),
    wallRunning: new Scene({
        bgImage_: './images/Backgrounds/WallRunning.png',
        startPos_: { x: 150, y: 300 },
        collisionData_: projectMapCollisions,
        collisionColumns_: 45,
        cameraStart_: { x: 0, y: -175 }
    }),
    flubby: new Scene({
        bgImage_: './images/Backgrounds/Flubby.png',
        startPos_: { x: 150, y: 300 },
        collisionData_: projectMapCollisions,
        collisionColumns_: 45,
        cameraStart_: { x: 0, y: -175 }
    }),
    captisCrystali: new Scene({
        bgImage_: './images/Backgrounds/CaptisCrystali.png',
        startPos_: { x: 150, y: 300 },
        collisionData_: projectMapCollisions,
        collisionColumns_: 45,
        cameraStart_: { x: 0, y: -175 }
    }),
    bulletSelection: new Scene({
        bgImage_: './images/Backgrounds/BulletSelection.png',
        startPos_: { x: 150, y: 300 },
        collisionData_: projectMapCollisions,
        collisionColumns_: 45,
        cameraStart_: { x: 0, y: -175 }
    })
}

const SceneMan = new SceneManager(Scenes.homeScene)
const GameController = new Controller()

const groundCollisions2D = []
const grappleCollisions2D = []
const teleRockCollisions2D = []
SceneMan.currentScene.StartScene()
collisionBlocks = SceneMan.currentScene.collisionBlocks
grappleBlocks = SceneMan.currentScene.grappleBlocks
teleRockBlocks = SceneMan.currentScene.teleRockBlocks

const player = new Player({
    position: {
        x: 150,
        y: 0,
    },
    collisionBlocks,
    imageSrc: './images/Player/Idle.png',
    frameRate: 1,
    animations: {
        Idle: {
            imageSrc: './images/Player/Idle.png',
            frameRate: 1,
            frameBuffer: 4,
            loop: true
        },
        Jump: {
            imageSrc: './images/Player/Jump.png',
            frameRate: 6,
            frameBuffer: 5,
            loop: false
        },
        Land: {
            imageSrc: './images/Player/Land.png',
            frameRate: 4,
            frameBuffer: 5,
            loop: false
        }
    }
})



const camera = {
    position: {
        x: 0,
        y: 0,
    }
}

function anim(timestamp) {
    //This function makes this function loop, allowing it to be the game loop
    //It will update all other objects. Objects will have their own update functions that will be called here.
    window.requestAnimationFrame(anim)

    //Set new deltatime
    deltaTime = (timestamp - lastTimestamp) / perfectTimeframe
    lastTimestamp = timestamp

    //Clear the canvas for re-drawing
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Save context so we are able to scale and redraw properly
    context.save()
    //context.scale(1.5, 1.5)

    //Translate the canvas to accurately represent the camera location
    context.translate(camera.position.x, camera.position.y)

    //Update all objects below
    SceneMan.Update()
    player.update()
    GameController.Update()

    //**Uncomment the below to draw the collision boxes for debugging purposes
    //for (i = 0; i < SceneMan.currentScene.grappleBlocks.length; i++) {
    //   SceneMan.currentScene.grappleBlocks[i].update()
    //}

    //Restore context
    context.restore()
}

//Start the game loop
anim()