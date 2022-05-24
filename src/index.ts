
import * as PIXI from 'pixi'
const canvas = document.querySelector("canvas");

			const height = 500
			const width = 600

			const app = new PIXI.Application({
				view: canvas,
				width: width,
				height: height,
				backgroundColor: 0xFF000
			});
			let img = new PIXI.Sprite.from("resources/space.png");
			app.stage.addChild(img);
			let points = 0;
			let livesn = 3;
			function createGameScene(gameScene, gainedPoints, n) {
				const style = new PIXI.TextStyle({ fill: "#eee", fontSize: 20 });

				const score = new PIXI.Text(`Score: ${gainedPoints}`, style);
				const lives = new PIXI.Text(`Lives: ${n}`,style)
				lives.position.x = 480;
				lives.position.y = 20;
				score.position.x = 20;
				score.position.y = 20;
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
				sprite.position.x = width/2-25;
				sprite.position.y = 300;
				players.addChild(sprite);

				let isMouseFlag = false;
				let lastBulletSpawnTime = 0;
				const spawnSpeed = 250;
				const keysMaps = {};
				const speed = 10;
				const bulletSpeed = 15;

				const enemyCount = 10;

				for (let index = 0; index < enemyCount; index++) {
					const enemy = PIXI.Sprite.from("resources/enemy.png");
					enemy.position.x = index * 50;
					enemy.position.y = Math.floor(Math.random() * 100) + 1;;
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

						if ((currentTime - lastBulletSpawnTime) > spawnSpeed) {

							const bullet = PIXI.Sprite.from("resources/bullet.png");
							bullet.position.x = sprite.position.x;
							bullet.position.y = sprite.position.y;
							bullet.scale.x = 0.25;
							bullet.scale.y = 0.25;
							bullets.addChild(bullet);

							lastBulletSpawnTime = currentTime;
						}
					}

					for (let index = 0; index < bullets.children.length; index++) {
						const bullet = bullets.children[index];
						bullet.position.y -= bulletSpeed * delay;

						if (bullet.position.y < 0) {
							bullets.removeChild(bullet);
							continue;
						}

						for (const enemy of enemies.children) {
							if (enemy.getBounds().intersects(bullet.getBounds())) {
								enemies.removeChild(enemy);
								points += 1;
								score.text = `Score: ${points}`;
							}
						}
					}
					for (const enemy of enemies.children) {
						if(enemy.getBounds().intersects(sprite.getBounds()))
							{
								livesn -= 1;
								enemies.removeChild(enemy);
								lives.text = `Lives: ${livesn}`;
							}
						}
					if (enemies.children < 1) {
						app.stage.removeChild(gameScene);
						app.stage.addChild(win);
					}
					if (livesn < 1)
					{
						app.stage.removeChild(gameScene);
						app.stage.addChild(lose);
					}

					for (const enemy of enemies.children) {
						enemy.position.y += 2 * delay;
						if(enemy.position.y > height)
							enemy.position.y = -50
					}
				};
				
			}

			
			const gameScene = new PIXI.Container();
			const updateScene = createGameScene(gameScene, points, livesn);

			let state = "mainMenu";

			const mainScene = new PIXI.Container();
			
			const style = new PIXI.TextStyle({ fill: "#eee", fontSize: 20 });
			const field = new PIXI.Text("Start Game", style);
			const win = new PIXI.Text("win",style)
			win.position.y = height/2;
			win.position.x = width/2;

			const lose = new PIXI.Text("Game over",style)
			lose.position.y = height/2;
			lose.position.x = width/2;
			
			field.interactive = true;
			field.buttonMode = true;
			field.scale.x = 2;
			field.position.x = 300;
			field.position.y = 300;
			
            
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