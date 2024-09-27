/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {

    init() {
        this.playerSpeed = 3;

        this.enemyMinSpeed = 1.5;
        this.enemyMaxSpeed = 3.5;

        this.enemyMinY = 80;
        this.enemyMaxY = 280;

        this.isTerminating = false;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('enemy', 'assets/dragon.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('goal', 'assets/treasure.png');
    }

    create() {
        const background = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0);

        this.player = this.add.sprite(50, this.sys.game.config.height / 2, 'player');
        this.player.setScale(0.7, 0.7);

        this.goal = this.add.sprite(this.sys.game.config.width - 50,
            this.sys.game.config.height / 2, 'goal');

        this.enemies = this.add.group({
            key: 'enemy',
            repeat: 4,
            setXY: {
                x: 110,
                y: 100,
                stepX: 100,
                stepY: 30
            }
        });

        Phaser.Actions.Call(this.enemies.getChildren(), (enemy) => {
            enemy.setFlip(true);
            enemy.setScale(0.8, 0.8);

            const direction = Phaser.Math.RND.pick([ -1, 1 ]);
            const speed = Phaser.Math.RND.realInRange(this.enemyMinSpeed, this.enemyMaxSpeed);

            enemy.setData('speed', direction * speed);
        });
    }

    update() {
        if (this.isTerminating) {
            return;
        }

        if (this.input.activePointer.isDown) {
            this.player.setX(this.player.x + this.playerSpeed);
        }

        const playerRect = this.player.getBounds();
        const goalRect = this.goal.getBounds();
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
            this.gameOver();
        }

        Phaser.Actions.Call(this.enemies.getChildren(), (enemy) => {
            const reachedBottomLimit = enemy.getData('speed') > 0 && enemy.y >= this.enemyMaxY;
            const reachedTopLimit = enemy.getData('speed') < 0 && enemy.y <= this.enemyMinY;
            if (reachedBottomLimit || reachedTopLimit) {
                enemy.setData('speed', enemy.getData('speed') * -1);
            }

            enemy.setY(enemy.y + enemy.getData('speed'));

            const enemyRect = enemy.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
                this.gameOver();
            }
        });
    }

    gameOver() {
        this.isTerminating = true;

        this.cameras.main.shake(500);

        this.cameras.main.on('camerashakecomplete', () => {
            this.cameras.main.fadeOut(500);
        });

        this.cameras.main.on('camerafadeoutcomplete', () => {
            this.scene.restart();
        });
    }
}

const gameScene = new GameScene('game');
const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
});
