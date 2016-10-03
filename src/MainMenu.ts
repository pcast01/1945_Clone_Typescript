/// <reference path="../src/game.ts"/>
module JetFire{
	export class MainMenu extends Phaser.State {
		constructor(){
            super();
        }
	
        music: Phaser.Sprite;
        playButton: Phaser.Sprite;
		loadingText: Phaser.Text;
		
		create()
		{
			// add the 'logo' sprite to the game, position it in the
			// center of the screen, and set the anchor to the center of
			// the image so it's centered properly. There's a lot of
			// centering in that last sentence
			this.add.sprite(0,0,'titlepage');
            this.loadingText = this.add.text(this.game.width/ 2, this.game.height / 2 + 80, "Press Z or tap/click game to start", { font: "20px monospace", fill: "#fff" });
			this.loadingText.anchor.setTo(0.5, 0.5);
			this.add.text(this.game.width / 2, this.game.height - 90, "image assets Copyright (c) 2002 Ari Feldman", { font: "12px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);
			this.add.text(this.game.width / 2, this.game.height - 75, "sound assets Copyright (c) 2012 - 2013 Devin Watson", { font: "12px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);
		}

		update()
		{
			if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
				this.startGame();
			}
		}

		startGame()
		{
			this.game.state.start('Game');
		}
	}
}