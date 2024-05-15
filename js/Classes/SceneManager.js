class SceneManager
{
    constructor(startingScene_) {
        this.currentScene = startingScene_
    }

    //This scene will swap the current scene, and set the player to the correct location to start the scene
    SwapScene(scene) {
        this.currentScene = scene
        scene.StartScene()

        player.position = { x: this.currentScene.startPos.x, y: this.currentScene.startPos.y }
        player.collisionBlocks = this.currentScene.collisionBlocks
        player.teleRockBlocks = this.currentScene.teleRockBlocks
        camera.position = { x: this.currentScene.cameraStart.x, y: this.currentScene.cameraStart.y }
    }

    //Call the current scene's update functions
    Update() {
        this.currentScene.Update()
    }
}