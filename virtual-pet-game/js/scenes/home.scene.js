class HomeScene extends Phaser.Scene {
    create() {
        this.bg = this.add.sprite(0, 0, 'background').setInteractive();
        this.bg.setOrigin(0, 0);
        this.bg.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start('game');
        });

        this.startText = this.add.text(0, 0, 'START GAME', {
            font: '40px Arial'
        });

        Phaser.Display.Align.In.Center(this.startText, this.bg);

        this.textBg = this.add.rectangle(
            0, 0,
            this.startText.width + 40,
            this.startText.height + 40,
            0x000000,
            0.5
        );

        Phaser.Display.Align.In.Center(this.textBg, this.bg);

        this.textBg.setDepth(1);
        this.startText.setDepth(2);
    }
}