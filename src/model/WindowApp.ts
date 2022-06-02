import * as PIXI from 'pixi.js';

export class WindowApp extends PIXI.Application {
    constructor(canvas:any, width:number, height:number, color:number){
        super({
            view: canvas,
            width: width,
            height: height,
            backgroundColor: color
        })
    }
}