/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    init() {
        this.playerSpeed = 150;
        this.jumpSpeed = -600;
    }

    preload() {
        this.load.image('barrel', 'assets/barrel.png');
        this.load.image('block', 'assets/block.png');
        this.load.image('gorilla', 'assets/gorilla3.png');
        this.load.image('ground', 'assets/ground.png');

        this.load.spritesheet('player', 'assets/player_spritesheet.png', {
            frameWidth: 28,
            frameHeight: 30,
            margin: 1,
            spacing: 1
        });

        this.load.spritesheet('fire', 'assets/fire_spritesheet.png', {
            frameWidth: 20,
            frameHeight: 21,
            margin: 1,
            spacing: 1
        });

        this.load.json('levelData', 'assets/level.json');
    }

    create() {
        this.levelData = this.cache.json.get('levelData');

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('player', {
                frames: [ 0, 1, 2 ]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'burn',
            frames: this.anims.generateFrameNames('fire', {
                frames: [ 0, 1 ]
            }),
            frameRate: 4,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.setupLevel();

        this.setupSpawner();
    }

    setupLevel() {
        this.platforms = this.add.group();

        for (const platform of this.levelData.platforms) {
            const width = this.textures.get(platform.texture).get(0).width;
            const height = this.textures.get(platform.texture).get(0).height;
            const platformSprite = this.add.tileSprite(
                platform.x, platform.y,
                width * platform.tileCount, height, platform.texture
            );
            platformSprite.setOrigin(0, 0);

            this.physics.add.existing(platformSprite, true);
            this.platforms.add(platformSprite);
        }

        this.fires = this.add.group();

        for (const fire of this.levelData.fires) {
            const fireSprite = this.add.sprite(fire.x, fire.y, 'fire');
            fireSprite.anims.play('burn');
            this.physics.add.existing(fireSprite, true);
            this.fires.add(fireSprite);
        }

        this.player = this.add.sprite(
            this.levelData.player.x, this.levelData.player.y, 'player', 3);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.gorilla = this.add.sprite(
            this.levelData.gorilla.x, this.levelData.gorilla.y, 'gorilla'
        );
        this.physics.add.existing(this.gorilla);

        this.physics.add.collider([this.player, this.gorilla], this.platforms);
        this.physics.add.overlap(this.player, [this.gorilla, this.fires],
            () => this.restartGame());
    }

    setupSpawner() {
        this.barrels = this.add.group();

        this.time.addEvent({
            delay: this.levelData.spawner.interval,
            repeat: -1,
            callback: () => {
                const barrel = this.add.sprite(this.gorilla.x, this.gorilla.y, 'barrel');
                this.physics.add.existing(barrel);
                this.barrels.add(barrel);

                barrel.body.setCollideWorldBounds(true);
                barrel.body.setVelocityX(this.levelData.spawner.speed);
                barrel.body.setBounceX(1);
                barrel.body.setBounceY(0.1);

                this.time.addEvent({
                    delay: this.levelData.spawner.lifespan,
                    repeat: 0,
                    callback: () => barrel.destroy()
                });
            }
        });

        this.physics.add.collider(this.barrels, this.platforms);
        this.physics.add.overlap(this.barrels, this.player, () => this.restartGame());
    }

    restartGame() {
        this.cameras.main.fade(500);

        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.restart();
        });
    }

    update() {
        const onGround = this.player.body.blocked.down;

        if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(this.playerSpeed);
            this.player.setFlipX(true);
            if (onGround) {
                this.player.anims.play('run', true);
            }
        }
        else if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed);
            this.player.setFlipX(false);
            if (onGround) {
                this.player.anims.play('run', true);
            }
        }
        else {
            this.player.body.setVelocityX(0);
            this.player.anims.stop();
            if (onGround) {
                this.player.setFrame(3);
            }
        }

        if (onGround
            && (this.cursors.up.isDown || this.cursors.space.isDown)) {
            
            this.player.anims.stop();
            this.player.setFrame(2);
            this.player.body.setVelocityY(this.jumpSpeed);
        }
    }
}

const gameScene = new GameScene('game');

const game = new Phaser.Game({
    width: 360,
    height: 640,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            debug: true
        }
    }
});