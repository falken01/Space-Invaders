import * as PIXI from 'pixi.js';

export class Bullet extends PIXI.Sprite {
    bulletSpeed:number;
    static spawnSpeed:number = 250;
    constructor(speed:number, texture:PIXI.Texture, x:number, y:number, scale:number){
        super(texture);
        this.bulletSpeed = speed;
        this.position.x = x;
        this.position.y = y;
        this.scale.x = scale;
        this.scale.y = scale;
    }

    public updatePosition(delay:number):void {
        this.position.y -= this.bulletSpeed * delay;
    }
}

