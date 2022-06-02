import * as PIXI from 'pixi.js';

export class Game {     // Game state class
    public lives:number;
    public points:number;
    public height:number;
    public width:number;
    constructor(height:number, width:number, lives:number, points:number) {
        this.lives = lives;
        this.points = points;
        this.height = height;
        this.width = width;
    }
    public getLives():number {
        return this.lives;
    }
    public getPoints():number {
        return this.points;
    }
    public addPoint():void {
        this.points++;
    }
    public substractLive():void {
        this.lives--;
    }
}