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
    }

    create() {
        this.platforms = this.add.group();

        this.ground = this.add.sprite(180, 610, 'ground');
        this.physics.add.existing(this.ground, true);
        this.platforms.add(this.ground);

        this.platform = this.add.tileSprite(180, 500, 5 * 36, 30, 'block');
        this.physics.add.existing(this.platform, true);
        this.platforms.add(this.platform);

        this.player = this.add.sprite(180, 450, 'player', 3);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('player', {
                frames: [ 0, 1, 2 ]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();
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