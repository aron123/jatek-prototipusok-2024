/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    init() {
        this.stats = { health: 100, fun: 100 };

        this.uiBlocked = false;
    }

    preload() {
        this.load.image('background', 'assets/backyard.png');
        this.load.image('apple', 'assets/apple.png');
        this.load.image('candy', 'assets/candy.png');
        this.load.image('toy', 'assets/rubber_duck.png');
        this.load.image('rotate', 'assets/rotate.png');
    
        this.load.spritesheet('pet', 'assets/pet.png', {
            frameWidth: 97,
            frameHeight: 83,
            spacing: 1,
            margin: 1
        });
    }

    create() {
        this.bg = this.add.sprite(0, 0, 'background').setInteractive();
        this.bg.setOrigin(0, 0);

        this.bg.on(Phaser.Input.Events.POINTER_DOWN,
            (pointer) => this.placeItem(pointer.downX, pointer.downY));

        this.pet = this.add.sprite(100, 200, 'pet', 0).setInteractive();

        this.input.setDraggable(this.pet);

        this.pet.on(Phaser.Input.Events.DRAG, (pointer, x, y) => {
            this.pet.setX(x);
            this.pet.setY(y);
        });

        this.createUi();
    }

    createUi() {
        this.appleBtn = this.add.sprite(72, 600, 'apple').setInteractive();
        this.appleBtn.setData('stats', { health: 20, fun: 0 });
        this.appleBtn.on(Phaser.Input.Events.POINTER_DOWN,
            () => this.pickItem(this.appleBtn));

        this.candyBtn = this.add.sprite(144, 600, 'candy').setInteractive();
        this.candyBtn.setData('stats', { health: -15, fun: 10 });
        this.candyBtn.on(Phaser.Input.Events.POINTER_DOWN,
            () => this.pickItem(this.candyBtn));

        this.toyBtn = this.add.sprite(216, 600, 'toy').setInteractive();
        this.toyBtn.setData('stats', { health: 5, fun: 5 });
        this.toyBtn.on(Phaser.Input.Events.POINTER_DOWN,
            () => this.pickItem(this.toyBtn));

        this.rotateBtn = this.add.sprite(288, 600, 'rotate').setInteractive();
        this.rotateBtn.setData('stats', { health: 5, fun: 10 });
        this.rotateBtn.on(Phaser.Input.Events.POINTER_DOWN,
            () => this.rotatePet(this.rotateBtn));
    }

    pickItem(item) {
        if (this.uiBlocked) {
            return;
        }

        this.setUiReady();
        this.selectedItem = item;
        item.setAlpha(0.5);
    }

    placeItem(x, y) {
        if (this.uiBlocked || !this.selectedItem) {
            return;
        }

        this.uiBlocked = true;

        const selectedTexture = this.selectedItem.texture.key;
        const newItem = this.add.sprite(x, y, selectedTexture);
        this.updateStats(this.selectedItem.getData('stats'));

        console.log(this.stats);
    }

    rotatePet(item) {
        if (this.uiBlocked) {
            return;
        }

        this.setUiReady();
        item.setAlpha(0.5);
        this.uiBlocked = true;

        this.tweens.add({
            targets: this.pet,
            angle: 360,
            duration: 600,
            onComplete: () => {
                this.updateStats(item.getData('stats'));
                this.setUiReady();

                console.log(this.stats);
            }
        });
    }

    setUiReady() {
        this.selectedItem = null;
        this.uiBlocked = false;

        this.appleBtn.setAlpha(1);
        this.candyBtn.setAlpha(1);
        this.toyBtn.setAlpha(1);
        this.rotateBtn.setAlpha(1);
    }

    updateStats(statsDelta) {
        this.stats.health += statsDelta.health;
        this.stats.fun += statsDelta.fun;
    }
}

const gameScene = new GameScene('game');

const game = new Phaser.Game({
    width: 360,
    height: 640,
    scene: gameScene
});