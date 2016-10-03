
module JetFire{
	const SEA_SCROLL_SPEED: number = 12;
	const PLAYER_SPEED: number = 300;
	const ENEMY_MAX_Y_VELOCITY: number = 60;
	const ENEMY_MIN_Y_VELOCITY: number = 30;
	const SHOOTER_MIN_VELOCITY: number = 30;
	const SHOOTER_MAX_VELOCITY: number = 80;
	const BOSS_Y_VELOCITY: number = 15;
	const BOSS_X_VELOCITY: number = 200;
	const BULLET_VELOCITY: number = 500;
	const ENEMY_BULLET_VELOCITY: number = 150;
	const POWERUP_VELOCITY: number = 100;

	const SPAWN_ENEMY_DELAY: number = Phaser.Timer.SECOND;
	const SPAWN_SHOOTER_DELAY: number = Phaser.Timer.SECOND * 3;

	const SHOT_DELAY: number = Phaser.Timer.SECOND * 0.1;
	const SHOOTER_SHOT_DELAY: number = Phaser.Timer.SECOND * 2;
	const DESTROYER_SHOT_DELAY: number =Phaser.Timer.SECOND * 4;
	const BOSS_SHOT_DELAY: number = Phaser.Timer.SECOND;

	const ENEMY_HEALTH: number = 2;
	const SHOOTER_HEALTH: number = 5;
	const BOSS_HEALTH: number = 500;

	const BULLET_DAMAGE: number = 1;
	const CRASH_DAMAGE: number = 5;

	const DESTROYER_REWARD: number = 50;
	const ENEMY_REWARD: number = 100;
	const SHOOTER_REWARD: number = 400;
	const BOSS_REWARD: number = 10000;
	const POWERUP_REWARD: number = 100;

	const ENEMY_DROP_RATE: number = 0.3;
	const SHOOTER_DROP_RATE: number = 0.5;
	const BOSS_DROP_RATE: number = 0;

	const PLAYER_EXTRA_LIVES: number = 3;
	const PLAYER_GHOST_TIME: number = Phaser.Timer.SECOND * 3;

	export class Boot extends Phaser.State {
		constructor(){
            super();
			this.input.maxPointers = 1;
			if (this.game.device.desktop) {
			}
			else {
				this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
				this.scale.setMinMax(480, 260, 1024, 768);
				this.scale.forceLandscape = true;
			}
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
        }
	
		preload()
		{
			// add our logo image to the assets class under the
			// key 'logo'. We're also setting the background colour
			// so it's the same as the background colour in the image
			this.load.image('preloaderBar', 'assets/preloader-bar.png');

		}
		
		create()
		{
			// add the 'logo' sprite to the game, position it in the
			// center of the screen, and set the anchor to the center of
			// the image so it's centered properly. There's a lot of
			// centering in that last sentence
			this.game.state.start('Preloader');
		}
	}
}
