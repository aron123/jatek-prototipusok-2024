class LoadingScene extends Phaser.Scene {
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

        this.bg = this.add.rectangle(
            0, 0,
            this.sys.game.config.width,
            this.sys.game.config.height,
            0xffffff
        );
        this.bg.setOrigin(0, 0);

        this.bgBar = this.add.rectangle(0, 0, 250, 40, 0xc6ecc6);
        Phaser.Display.Align.In.Center(this.bgBar, this.bg);

        this.progressBar = this.add.rectangle(0, 0, 0, 40, 0x267326);
        Phaser.Display.Align.In.TopLeft(this.progressBar, this.bgBar);

        this.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {
            this.progressBar.setSize(progress * 250, 40);
            Phaser.Display.Align.In.TopLeft(this.progressBar, this.bgBar);
        });
    }

    create() {
        this.anims.create({
            key: 'eat',
            duration: 500,
            frameRate: 7,
            frames: this.anims.generateFrameNames('pet', {
                frames: [ 1, 2, 3 ]
            }),
            yoyo: true
        });

        this.scene.start('home');
    }
}