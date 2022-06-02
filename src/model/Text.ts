import * as PIXI from 'pixi.js';
import { Style } from './Style';


export class TextBlock extends PIXI.Text {
    constructor(x:number, y:number, content:string, style:Style) {
        super(content,style)
        this.position.x = x;
        this.position.y = y;
    }
        
    setContent(content:string):void{
        this.text = content;
    }
}