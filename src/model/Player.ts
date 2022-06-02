import * as PIXI from 'pixi.js';

export class Player extends PIXI.Sprite {
    constructor(x:number, y:number, texture:PIXI.Texture){
        super(texture);
        this.position.x = x;
        this.position.y = y;
    }

    
}