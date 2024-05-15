class Physics
{
    constructor() {
        this.acceleration = {x:0, y:0}
    }

    SetVelocity() {
        player.velocity.x += this.acceleration.x * deltaTime
        player.velocity.y += this.acceleration.y * deltaTime
    }

    ApplyForce(force) {
        this.acceleration.x = force.x
        this.acceleration.y = force.y

        this.SetVelocity()
    }
}