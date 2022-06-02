import { WindowApp } from './model/WindowApp';
import { Style } from './model/Style';
import { Bullet } from './model/Bullet';
import * as PIXI from 'pixi'
import { TextBlock } from './model/Text';
import { Game } from './model/Game';
import { Enemy } from './model/Enemy';
const canvas = document.querySelector("canvas");
			const game:Game = new Game(500,600,0,3);
			const app:WindowApp = new WindowApp(canvas,game.width,game.height,0xFF000)

			let img = new PIXI.Sprite.from("resources/space.png");
			app.stage.addChild(img);

			function createGameScene(gameScene) {
				const coreStyle:Style = new Style("#eee",20);
				const score:TextBlock = new TextBlock(20, 20, `Score: ${game.getPoints()}`, coreStyle);
				const lives:TextBlock = new TextBlock(480,20,`Lives: ${game.getLives}`,coreStyle)
				gameScene.addChild(lives);
				gameScene.addChild(score);
				const background = new PIXI.Container();
				gameScene.addChild(background);

				const players = new PIXI.Container();
				gameScene.addChild(players);

				const bullets = new PIXI.Container();
				gameScene.addChild(bullets);

				const enemies = new PIXI.Container();
				gameScene.addChild(enemies);

				const sprite = PIXI.Sprite.from("resources/player.png");
				sprite.position.x = game.width/2-25;
				sprite.position.y = 300;
				players.addChild(sprite);

				let isMouseFlag = false;
				let lastBulletSpawnTime = 0;
				const keysMaps = {};
				const speed = 10;

				const enemyCount = 10;

				for (let index = 0; index < enemyCount; index++) {
					const enemy:Enemy = new Enemy(index * 50, Math.floor(Math.random() * 100) + 1, 10,PIXI.Sprite.from("resources/enemy.png"))
					enemies.addChild(enemy);
				}

				document.onkeydown = (event) => {
					keysMaps[event.code] = true;
				};

				document.onkeyup = (event) => {
					keysMaps[event.code] = false;
				};

				document.onmousedown = (event) => {
					isMouseFlag = true;
				};

				document.onmouseup = (event) => {
					isMouseFlag = false;
				};

				return (delay) => {
					if (keysMaps['ArrowLeft']) {
						sprite.position.x -= delay * speed;
					}
					if (keysMaps['ArrowRight']) {
						sprite.position.x += delay * speed;
					}
					if (keysMaps['ArrowUp']) {
						sprite.position.y -= delay * speed;
					}
					if (keysMaps['ArrowDown']) {
						sprite.position.y += delay * speed;
					}

					if (isMouseFlag) {
						const currentTime = Date.now();

						if ((currentTime - lastBulletSpawnTime) > Bullet.spawnSpeed) {
							const bullet:Bullet = new Bullet(15, PIXI.Sprite.from("resources/bullet.png"), sprite.position.x,sprite.position.y,0.25)
							bullets.addChild(bullet);
							lastBulletSpawnTime = currentTime;
						}
					}

					for (let index = 0; index < bullets.children.length; index++) {
						const bullet = bullets.children[index];
						bullet.updatePosition(delay)

						if (bullet.position.y < 0) {
							bullets.removeChild(bullet);
							continue;
						}

						for (const enemy of enemies.children) {
							if (enemy.getBounds().intersects(bullet.getBounds())) {
								enemies.removeChild(enemy);
								game.addPoint();
								score.setContent(`Score: ${game.getPoints()}`);
							}
						}
					}
					for (const enemy of enemies.children) {
						if(enemy.getBounds().intersects(sprite.getBounds()))
							{
								game.substractLive();
								enemies.removeChild(enemy);
								lives.setContent(`Lives: ${game.getLives()}`);
							}
						}
					if (enemies.children < 1) {
						app.stage.removeChild(gameScene);
						app.stage.addChild(win);
					}
					if (game.getLives() < 1)
					{
						app.stage.removeChild(gameScene);
						app.stage.addChild(lose);
					}

					for (const enemy of enemies.children) {
						enemy.updatePosition(delay);
						if(enemy.position.y > game.height)
							enemy.setStartPosition();
					}
				};
				
			}

			
			const gameScene = new PIXI.Container();
			const updateScene = createGameScene(gameScene);

			let state = "mainMenu";

			const mainScene = new PIXI.Container();
			
			const style = new PIXI.TextStyle({ fill: "#eee", fontSize: 20 });
			const field:TextBlock = new TextBlock(300,300,"Start Game", style);
			const win:TextBlock = new TextBlock(game.height/2, game.width/2,"win",style)
			const lose:TextBlock = new TextBlock(game.height/2, game.width/2,"Game over",style)

			field.interactive = true;
			field.buttonMode = true;
			field.scale.x = 2;

			mainScene.addChild(field);
			field.on('click', () => {
				state = "game";
				app.stage.removeChild(mainScene);
				app.stage.addChild(gameScene);
			});
			
			app.stage.addChild(mainScene);

			app.ticker.add(
				(delay) => {
					if (state === "game") {
						updateScene(delay);
					}
				}
			);