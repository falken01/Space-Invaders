var canvas = document.querySelector("canvas");
var height = 500;
var width = 600;
var app = new PIXI.Application({
    view: canvas,
    width: width,
    height: height,
    backgroundColor: 0xFF000
});
var img = new PIXI.Sprite.from("resources/space.png");
app.stage.addChild(img);
var points = 0;
var livesn = 3;
function createGameScene(gameScene, gainedPoints, n) {
    var style = new PIXI.TextStyle({ fill: "#eee", fontSize: 20 });
    var score = new PIXI.Text("Score: ".concat(gainedPoints), style);
    var lives = new PIXI.Text("Lives: ".concat(n), style);
    lives.position.x = 480;
    lives.position.y = 20;
    score.position.x = 20;
    score.position.y = 20;
    gameScene.addChild(lives);
    gameScene.addChild(score);
    var background = new PIXI.Container();
    gameScene.addChild(background);
    var players = new PIXI.Container();
    gameScene.addChild(players);
    var bullets = new PIXI.Container();
    gameScene.addChild(bullets);
    var enemies = new PIXI.Container();
    gameScene.addChild(enemies);
    var sprite = PIXI.Sprite.from("resources/player.png");
    sprite.position.x = width / 2 - 25;
    sprite.position.y = 300;
    players.addChild(sprite);
    var isMouseFlag = false;
    var lastBulletSpawnTime = 0;
    var spawnSpeed = 250;
    var keysMaps = {};
    var speed = 10;
    var bulletSpeed = 15;
    var enemyCount = 10;
    for (var index = 0; index < enemyCount; index++) {
        var enemy = PIXI.Sprite.from("resources/enemy.png");
        enemy.position.x = index * 50;
        enemy.position.y = Math.floor(Math.random() * 100) + 1;
        ;
        enemies.addChild(enemy);
    }
    document.onkeydown = function (event) {
        keysMaps[event.code] = true;
    };
    document.onkeyup = function (event) {
        keysMaps[event.code] = false;
    };
    document.onmousedown = function (event) {
        isMouseFlag = true;
    };
    document.onmouseup = function (event) {
        isMouseFlag = false;
    };
    return function (delay) {
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
            var currentTime = Date.now();
            if ((currentTime - lastBulletSpawnTime) > spawnSpeed) {
                var bullet = PIXI.Sprite.from("resources/bullet.png");
                bullet.position.x = sprite.position.x;
                bullet.position.y = sprite.position.y;
                bullet.scale.x = 0.25;
                bullet.scale.y = 0.25;
                bullets.addChild(bullet);
                lastBulletSpawnTime = currentTime;
            }
        }
        for (var index = 0; index < bullets.children.length; index++) {
            var bullet = bullets.children[index];
            bullet.position.y -= bulletSpeed * delay;
            if (bullet.position.y < 0) {
                bullets.removeChild(bullet);
                continue;
            }
            for (var _i = 0, _a = enemies.children; _i < _a.length; _i++) {
                var enemy = _a[_i];
                if (enemy.getBounds().intersects(bullet.getBounds())) {
                    enemies.removeChild(enemy);
                    points += 1;
                    score.text = "Score: ".concat(points);
                }
            }
        }
        for (var _b = 0, _c = enemies.children; _b < _c.length; _b++) {
            var enemy = _c[_b];
            if (enemy.getBounds().intersects(sprite.getBounds())) {
                livesn -= 1;
                enemies.removeChild(enemy);
                lives.text = "Lives: ".concat(livesn);
            }
        }
        if (enemies.children < 1) {
            app.stage.removeChild(gameScene);
            app.stage.addChild(win);
        }
        if (livesn < 1) {
            app.stage.removeChild(gameScene);
            app.stage.addChild(lose);
        }
        for (var _d = 0, _e = enemies.children; _d < _e.length; _d++) {
            var enemy = _e[_d];
            enemy.position.y += 2 * delay;
            if (enemy.position.y > height)
                enemy.position.y = -50;
        }
    };
}
var gameScene = new PIXI.Container();
var updateScene = createGameScene(gameScene, points, livesn);
var state = "mainMenu";
var mainScene = new PIXI.Container();
var style = new PIXI.TextStyle({ fill: "#eee", fontSize: 20 });
var field = new PIXI.Text("Start Game", style);
var win = new PIXI.Text("win", style);
win.position.y = height / 2;
win.position.x = width / 2;
var lose = new PIXI.Text("Game over", style);
lose.position.y = height / 2;
lose.position.x = width / 2;
field.interactive = true;
field.buttonMode = true;
field.scale.x = 2;
field.position.x = 300;
field.position.y = 300;
mainScene.addChild(field);
field.on('click', function () {
    state = "game";
    app.stage.removeChild(mainScene);
    app.stage.addChild(gameScene);
});
app.stage.addChild(mainScene);
app.ticker.add(function (delay) {
    if (state === "game") {
        updateScene(delay);
    }
});
