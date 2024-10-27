/// <reference path="./types/index.d.ts" />

const Keys = {
    Building: 'building',
    Car: 'car',
    House: 'house',
    Tree: 'tree'
};

class GameScene extends Phaser.Scene {

    init() {
        this.answers = {
            [Keys.Building]: 'edificio',
            [Keys.Car]: 'automóvil',
            [Keys.House]: 'casa',
            [Keys.Tree]: 'árbol'
        };
    }

    preload() {
        this.load.image('background', 'assets/img/background-city.png');
        this.load.image(Keys.Building, 'assets/img/building.png');
        this.load.image(Keys.Car, 'assets/img/car.png');
        this.load.image(Keys.House, 'assets/img/house.png');
        this.load.image(Keys.Tree, 'assets/img/tree.png');
    
        this.load.audio('correct', 'assets/audio/correct.mp3');
        this.load.audio('wrong', 'assets/audio/wrong.mp3');

        this.load.audio(Keys.Building + 'Audio', 'assets/audio/edificio.mp3');
        this.load.audio(Keys.Car + 'Audio', 'assets/audio/auto.mp3');
        this.load.audio(Keys.House + 'Audio', 'assets/audio/casa.mp3');
        this.load.audio(Keys.Tree + 'Audio', 'assets/audio/arbol.mp3');
    }

    create() {
        const bg = this.add.sprite(0, 0, 'background');
        bg.setOrigin(0, 0);

        this.wordText = this.add.text(20, 20, '', {
            font: '32px Arial',
            fill: 'yellow'
        });

        this.correctAudio = this.sound.add('correct');
        this.wrongAudio = this.sound.add('wrong');

        this.items = this.add.group([
            {
                key: Keys.Building,
                setXY: {
                    x: 80,
                    y: 250
                }
            },
            {
                key: Keys.Car,
                setXY: {
                    x: 240,
                    y: 290
                },
                setScale: {
                    x: 0.8,
                    y: 0.8
                }
            },
            {
                key: Keys.House,
                setXY: {
                    x: 430,
                    y: 270
                }
            },
            {
                key: Keys.Tree,
                setXY: {
                    x: 570,
                    y: 250
                }
            },
        ]);

        Phaser.Actions.Call(this.items.getChildren(), (item) => {
            item.setInteractive();

            item.setData('spanish', this.answers[item.texture.key]);
            const audio = this.sound.add(item.texture.key + 'Audio');
            item.setData('audio', audio);

            const correctTween = this.tweens.add({
                targets: item,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 300,
                paused: true,
                persist: true,
                yoyo: true,
                ease: Phaser.Math.Easing.Quadratic.InOut
            });

            const wrongTween = this.tweens.add({
                targets: item,
                scaleX: 1.5,
                scaleY: 1.5,
                angle: 90,
                duration: 300,
                paused: true,
                persist: true,
                yoyo: true,
                ease: Phaser.Math.Easing.Quadratic.InOut
            });

            const alphaTween = this.tweens.add({
                targets: item,
                alpha: 0.7,
                duration: 200,
                paused: true,
                persist: true
            });

            item.on(Phaser.Input.Events.POINTER_DOWN, () => {
                const userResponse = item.getData('spanish');
                const success = this.processAnswer(userResponse);

                if (success) {
                    correctTween.play();
                    this.showNextQuestion();
                } else {
                    wrongTween.play();
                }
            });

            item.on(Phaser.Input.Events.POINTER_OVER, () => {
                alphaTween.play();
            });

            item.on(Phaser.Input.Events.POINTER_OUT, () => {
                alphaTween.pause();
                item.alpha = 1;
            });
        });

        this.showNextQuestion();
    }

    showNextQuestion() {
        // pick word
        this.currentWord = Phaser.Math.RND.pick(this.items.getChildren());

        // show text
        this.wordText.setText(this.currentWord.getData('spanish'));

        // play sound
        this.currentWord.getData('audio').play();
    }

    processAnswer(userResponse) {
        const correctAnswer = this.currentWord.getData('spanish');

        if (correctAnswer == userResponse) {
            this.correctAudio.play();
            return true;
        } else {
            this.wrongAudio.play();
            return false;
        }
    }
}

const gameScene = new GameScene('game');
const game = new Phaser.Game({
    width: 640,
    height: 360,
    scene: gameScene
});