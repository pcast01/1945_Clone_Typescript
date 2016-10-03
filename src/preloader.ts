/// <reference path="../src/game.ts"/>
module JetFire{
	export class PreLoader extends Phaser.State {
		constructor(){
            super();
        }
	
        background: Phaser.Sprite;
        preloadBar: Phaser.Sprite;
		preload()
		{
			this.stage.backgroundColor = '#2d2d2d';
            this.preloadBar = this.add.sprite(this.game.width /2-100, this.game.height / 2, 'preloaderBar');
            this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);
		}
		
		create()
		{
			// add the 'logo' sprite to the game, position it in the
			// center of the screen, and set the anchor to the center of
			// the image so it's centered properly. There's a lot of
			// centering in that last sentence
			this.game.state.start('MainMenu');
		}
	}
}