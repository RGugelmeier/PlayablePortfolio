class teleRockBlock extends collisionBlock {
    constructor({ position_, teleToScene_ }) {
        super({position_})
        this.position = position_
        this.height = 32
        this.width = 32
        this.teleToScene = teleToScene_
    }
}