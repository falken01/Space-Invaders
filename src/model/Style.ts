import * as PIXI from 'pixi.js';

export class Style extends PIXI.TextStyle{
    constructor(color:string, fontsize:number){
        super({ fill: color, fontSize: fontsize })
    }
}