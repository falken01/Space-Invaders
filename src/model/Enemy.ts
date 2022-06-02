import * as PIXI from 'pixi.js';
import {Bullet} from './Bullet';

export class Enemy extends PIXI.Sprite {
    constructor(x:number, y:number,speed:number, textureUrl:PIXI.Texture){
        super(textureUrl);
        this.position.x = x;
        this.position.y = y;

    }
    setStartPosition():void {
        this.position.y = -50;
    }

    updatePosition(delay:number):void {
        this.position.y += 2 * delay;
    }
}