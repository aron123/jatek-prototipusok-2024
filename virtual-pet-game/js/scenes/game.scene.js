class GameScene extends Phaser.Scene {
    init() {
        this.stats = { health: 100, fun: 100 };

        this.statsDecay = { health: -5, fun: -2 };

        this.uiBlocked = false;
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

        this.healthText = this.add.text(20, 20, 'Health: 100', {
            font: '30px Arial'
        });

        this.funText = this.add.text(220, 20, 'Fun: 100', {
            font: '30px Arial'
        });

        this.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                this.updateStats(this.statsDecay);
            }
        });
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

        this.tweens.add({
            targets: this.pet,
            duration: 500,
            x: newItem.x,
            y: newItem.y,
            onComplete: () => {
                this.updateStats(this.selectedItem.getData('stats'));
                newItem.destroy();

                this.pet.play('eat');
                this.pet.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.setUiReady();
                    this.pet.setFrame(0);
                })
            }
        });
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

        if (this.stats.health <= 0 || this.stats.fun <= 0) {
            this.stats.health = 0;
            this.stats.fun = 0;

            this.gameOver();
        }

        this.healthText.setText('Health: ' + this.stats.health);
        this.funText.setText('Fun: ' + this.stats.fun);
    }

    gameOver() {
        this.uiBlocked = true;
        this.pet.setFrame(4);

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.scene.start('home');
            }
        });
    }
}