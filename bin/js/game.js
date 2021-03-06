var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var JetFire;
(function (JetFire) {
    var SEA_SCROLL_SPEED = 12;
    var PLAYER_SPEED = 300;
    var ENEMY_MAX_Y_VELOCITY = 60;
    var ENEMY_MIN_Y_VELOCITY = 30;
    var SHOOTER_MIN_VELOCITY = 30;
    var SHOOTER_MAX_VELOCITY = 80;
    var BOSS_Y_VELOCITY = 15;
    var BOSS_X_VELOCITY = 200;
    var BULLET_VELOCITY = 500;
    var ENEMY_BULLET_VELOCITY = 150;
    var POWERUP_VELOCITY = 100;
    var SPAWN_ENEMY_DELAY = Phaser.Timer.SECOND;
    var SPAWN_SHOOTER_DELAY = Phaser.Timer.SECOND * 3;
    var SHOT_DELAY = Phaser.Timer.SECOND * 0.1;
    var SHOOTER_SHOT_DELAY = Phaser.Timer.SECOND * 2;
    var DESTROYER_SHOT_DELAY = Phaser.Timer.SECOND * 4;
    var BOSS_SHOT_DELAY = Phaser.Timer.SECOND;
    var ENEMY_HEALTH = 2;
    var SHOOTER_HEALTH = 5;
    var BOSS_HEALTH = 500;
    var BULLET_DAMAGE = 1;
    var CRASH_DAMAGE = 5;
    var DESTROYER_REWARD = 50;
    var ENEMY_REWARD = 100;
    var SHOOTER_REWARD = 400;
    var BOSS_REWARD = 10000;
    var POWERUP_REWARD = 100;
    var ENEMY_DROP_RATE = 0.3;
    var SHOOTER_DROP_RATE = 0.5;
    var BOSS_DROP_RATE = 0;
    var PLAYER_EXTRA_LIVES = 3;
    var PLAYER_GHOST_TIME = Phaser.Timer.SECOND * 3;
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.call(this);
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
        Boot.prototype.preload = function () {
            // add our logo image to the assets class under the
            // key 'logo'. We're also setting the background colour
            // so it's the same as the background colour in the image
            this.load.image('preloaderBar', 'assets/preloader-bar.png');
        };
        Boot.prototype.create = function () {
            // add the 'logo' sprite to the game, position it in the
            // center of the screen, and set the anchor to the center of
            // the image so it's centered properly. There's a lot of
            // centering in that last sentence
            this.game.state.start('Preloader');
        };
        return Boot;
    }(Phaser.State));
    JetFire.Boot = Boot;
})(JetFire || (JetFire = {}));
/// <reference path="../src/game.ts"/>
var JetFire;
(function (JetFire) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this);
        }
        Game.prototype.create = function () {
            this.setupBackground();
            this.setupEnemies();
            this.setupPlayer();
            this.setupBullets();
            this.setupExplosions();
            this.setupPlayerIcons();
            this.setupText();
            this.setupAudio();
            this.setupBomb();
            this.cursors = this.input.keyboard.createCursorKeys();
        };
        Game.prototype.setupAudio = function () {
            this.sound.volume = 0.3;
            this.explosionSFX = this.add.audio('explosion');
            this.playerExplosionSFX = this.add.audio('playerExplosion');
            this.enemyFireSFX = this.add.audio('enemyFire');
            this.playerFireSFX = this.add.audio('playerFire');
            this.powerUpSFX = this.add.audio('powerUp');
        };
        Game.prototype.setupPlayerIcons = function () {
            this.powerUpPool = this.add.group();
            this.powerUpPool.enableBody = true;
            this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
            this.powerUpPool.createMultiple(5, 'powerup1');
            this.powerUpPool.setAll('anchor.x', 0.5);
            this.powerUpPool.setAll('anchor.y', 0.5);
            this.powerUpPool.setAll('outOfBoundsKill', true);
            this.powerUpPool.setAll('checkWorldBounds', true);
            this.powerUpPool.setAll('reward', BasicGame.POWERUP_REWARD, false, false, 0, true);
        };
        Game.prototype.setupBackground = function () {
            this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');
            this.sea.autoScroll(0, BasicGame.SEA_SCROLL_SPEED);
        };
        Game.prototype.setupPlayer = function () {
            this.player = this.add.sprite(this.game.width / 2, this.game.height - 50, 'player');
            this.player.anchor.setTo(0.5, 0.5);
            this.player.animations.add('fly', [0, 1, 2], 20, true);
            this.player.animations.add('ghost', [3, 0, 3, 1], 20, true);
            this.player.play('fly');
            this.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.speed = BasicGame.PLAYER_SPEED;
            this.player.body.collideWorldBounds = true;
            // 20 x 20 pixel hitbox, centered a little bit higher than the center
            this.player.body.setSize(20, 20, 0, -5);
            this.weaponLevel = 0;
        };
        Game.prototype.setupEnemies = function () {
            // Destroyer enemies
            this.destroyerPool = this.add.group();
            this.destroyerPool.enableBody = true;
            this.destroyerPool.physicsBodyType = Phaser.Physics.ARCADE;
            this.destroyerPool.createMultiple(25, 'destroyer');
            this.destroyerPool.setAll('anchor.x', 0.5);
            this.destroyerPool.setAll('anchor.y', 0.5);
            this.destroyerPool.setAll('outOfBoundsKill', true);
            this.destroyerPool.setAll('checkWorldBounds', true);
            this.destroyerPool.setAll('reward', BasicGame.DESTROYER_REWARD, false, false, 0, true);
            for (var destroyer in destroyerPool) {
                if (destroyerPool.hasOwnProperty(destroyer)) {
                    var element = destroyerPool[destroyer];
                    element.animations.add('sail', [1, 0, 1], 20, true);
                    element.animations.add('hit', [1, 2, 0, 2, 1], 20, false);
                    element.events.onAnimationComplete.add(function (e) {
                        e.play('sail');
                    }, this);
                }
            }
            this.nextDestroyerAt = this.time.now + Phaser.Timer.SECOND * 7;
            this.destroyerDelay = BasicGame.SPAWN_SHOOTER_DELAY;
            this.enemyPool = this.add.group();
            this.enemyPool.enableBody = true;
            this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemyPool.createMultiple(50, 'greenEnemy');
            this.enemyPool.setAll('anchor.x', 0.5);
            this.enemyPool.setAll('anchor.y', 0.5);
            this.enemyPool.setAll('outOfBoundSkill', true);
            this.enemyPool.setAll('checkWorldBounds', true);
            this.enemyPool.setAll('reward', BasicGame.ENEMY_REWARD, false, false, 0, true);
            this.enemyPool.setAll('dropRate', BasicGame.ENEMY_DROP_RATE, false, false, 0, true);
            // Set the animation for each sprites
            this.enemyPool.forEach(function (enemy) {
                enemy.animations.add('fly', [0, 1, 2], 20, true);
                enemy.animations.add('hit', [3, 1, 3, 2], 20, false);
                enemy.events.onAnimationComplete.add(function (e) {
                    e.play('fly');
                }, this);
            });
            this.nextEnemyAt = 0;
            this.enemyDelay = BasicGame.SPAWN_ENEMY_DELAY;
            this.shooterPool = this.add.group();
            this.shooterPool.enableBody = true;
            this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
            this.shooterPool.createMultiple(20, 'whiteEnemy');
            this.shooterPool.setAll('anchor.x', 0.5);
            this.shooterPool.setAll('anchor.y', 0.5);
            this.shooterPool.setAll('outOfBoundsKill', true);
            this.shooterPool.setAll('checkWorldBounds', true);
            this.shooterPool.setAll('reward', BasicGame.SHOOTER_REWARD, false, false, 0, true);
            this.shooterPool.setAll('dropRate', BasicGame.SHOOTER_DROP_RATE, false, false, 0, true);
            // Set the animation for each sprite
            this.shooterPool.forEach(function (enemy) {
                enemy.animations.add('fly', [0, 1, 2], 20, true);
                enemy.animations.add('hit', [3, 1, 3, 2], 20, false);
                enemy.events.onAnimationComplete.add(function (e) {
                    e.play('fly');
                }, this);
            });
            // start spawning 5 seconds into the game
            this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;
            this.shooterDelay = BasicGame.SPAWN_SHOOTER_DELAY;
            this.bossPool = this.add.group();
            this.bossPool.enableBody = true;
            this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
            this.bossPool.createMultiple(1, 'boss');
            this.bossPool.setAll('anchor.x', 0.5);
            this.bossPool.setAll('anchor.y', 0.5);
            this.bossPool.setAll('outOfBoundsKill', true);
            this.bossPool.setAll('reward', BasicGame.BOSS_REWARD, false, false, 0, true);
            this.bossPool.setAll('dropRate', BasicGame.BOSS_DROP_RATE, false);
            // Set the animation for each sprite
            this.bossPool.forEach(function (enemy) {
                enemy.animations.add('fly', [0, 1, 2], 20, true);
                enemy.animations.add('hit', [3, 2, 1, 2], 20, false);
                enemy.events.onAnimationComplete.add(function (e) {
                    e.play('fly');
                }, this);
            });
            this.boss = this.bossPool.getTop();
            this.bossApproaching = false;
        };
        Game.prototype.setupBullets = function () {
            this.enemyBulletPool = this.add.group();
            this.enemyBulletPool.enableBody = true;
            this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemyBulletPool.createMultiple(150, 'enemyBullet');
            this.enemyBulletPool.setAll('anchor.x', 0.5);
            this.enemyBulletPool.setAll('anchor.y', 0.5);
            this.enemyBulletPool.setAll('outOfBoundsKill', true);
            this.enemyBulletPool.setAll('checkWorldBounds', true);
            this.enemyBulletPool.setAll('reward', 0, false, false, 0, true);
            // Add an empty sprite group into our game
            this.bulletPool = this.add.group();
            // Add an empty sprite group into our game
            this.bulletPool = this.add.group();
            // Enable physics to the whole sprite group
            this.bulletPool.enableBody = true;
            this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
            // Add 100 'bullet' sprites in teh group.
            // By default this uses the first frame of the sprite sheet and 
            //  sets the initial state as non-existing (i.e. killed/dead)
            this.bulletPool.createMultiple(100, 'bullet');
            // Sets anchors of all sprites
            this.bulletPool.setAll('anchor.x', 0.5);
            this.bulletPool.setAll('anchor.y', 0.5);
            // Automatically kill the bullet sprites when they go out of bounds
            this.bulletPool.setAll('outOfBoundsKill', true);
            this.bulletPool.setAll('checkWorldBounds', true);
            this.nextShotAt = 0;
            this.shotDelay = BasicGame.SHOT_DELAY;
        };
        Game.prototype.setupExplosions = function () {
            this.explosionPool = this.add.group();
            this.explosionPool.enableBody = true;
            this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
            this.explosionPool.createMultiple(100, 'explosion');
            this.explosionPool.setAll('anchor.x', 0.5);
            this.explosionPool.setAll('anchor.y', 0.5);
            this.explosionPool.forEach(function (explosion) {
                explosion.animations.add('boom');
            });
        };
        Game.prototype.setupBomb = function () {
            this.bombPool = this.add.group();
            this.bombPool.enableBody = true;
            this.bombPool.physicsBodyType = Phaser.Physics.ARCADE;
            this.bombPool.createMultiple(5, 'bombBlast');
            this.bombPool.setAll('anchor.x', 0.5);
            this.bombPool.setAll('anchor.y', 0.5);
            this.bombPool.forEach(function (bomb) {
                bomb.animations.add('blast');
            });
            this.nextBombAt = 0;
        };
        Game.prototype.setupText = function () {
            this.instructions = this.add.text(this.game.width / 2, this.game.height - 100, 'Use Arrow Keys to Move, Press Z to Fire\n' +
                'Tapping/clicking does both', { font: '20px monospace', fill: '#fff', align: 'center' });
            this.instructions.anchor.setTo(0.5, 0.5);
            this.instExpire = this.time.now + BasicGame.ENEMY_MAX_Y_VELOCITY;
            this.score = 0;
            this.scoretText = this.add.text(this.game.width / 2, 30, '' + this.score, { font: '20px monospace', fill: '#fff', align: 'center' });
            this.scoretText.anchor.setTo(0.5, 0.5);
        };
        Game.prototype.bombExplode = function () {
            if (this.bombPool.countDead() === 0) {
                return;
            }
            var bombExplosion = this.bombPool.getFirstExists(false);
            bombExplosion.play('blast', 20, false, true);
        };
        Game.prototype.explode = function (spriteExplode) {
            if (this.explosionPool.countDead() === 0) {
                return;
            }
            var explosion = this.explosionPool.getFirstExists(false);
            explosion.reset(spriteExplode.x, spriteExplode.y);
            explosion.play('boom', 15, false, false, true);
            // add original sprites velocity to the explosion
            explosion.body.velocity.x = spriteExplode.body.velocity.x;
            explosion.body.velocity.y = spriteExplode.body.velocity.y;
        };
        Game.prototype.update = function () {
            this.checkCollisions();
            this.spawnEnemies();
            this.enemyFire();
            this.processPlayerInput();
            this.processDelayedEffects();
        };
        Game.prototype.enemyFire = function () {
            this.shooterPool.forEachAlive(function (enemy) {
                if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {
                    var bullet = this.enemyBulletPool.getFirstExists(false);
                    bullet.reset(enemy.x, enemy.y);
                    this.physics.arcade.moveToObject(bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY);
                    enemy.nextShotAt = this.time.now + BasicGame.SHOOTER_SHOT_DELAY;
                    this.enemyFireSFX.play();
                }
            }, this);
            // Destroyer firings
            this.destroyerPool.forEachAlive(function (enemy) {
                if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {
                    var bullet = this.enemyBulletPool.getFirstExists(false);
                    bullet.reset(enemy.x, enemy.y);
                    this.physics.arcade.moveToObject(bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY);
                    enemy.nextShotAt = this.time.now + BasicGame.DESTROYER_SHOT_DELAY;
                    this.enemyFireSFX.play();
                }
            }, this);
            if (this.bossApproaching === false && this.boss.alive &&
                this.boss.nextShotAt < this.time.now &&
                this.enemyBulletPool.countDead() >= 10) {
                this.boss.nextShotAt = this.time.now + BasicGame.BOSS_SHOT_DELAY;
                this.enemyFireSFX.play();
                for (var i = 0; i < 5; i++) {
                    //process 2 bullets at a time
                    var leftBullet = this.enemyBulletPool.getFirstExists(false);
                    leftBullet.reset(this.boss.x - 10 - 1 * 10, this.boss.y + 20);
                    var rightBullet = this.enemyBulletPool.getFirstExists(false);
                    rightBullet.reset(this.boss.x + 10 + i * 10, this.boss.y + 20);
                    if (this.boss.health > BasicGame.BOSS_HEALTH / 2) {
                        // AIM directly st the player
                        this.physics.arcade.moveToObject(leftBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY);
                        this.physics.arcade.moveToObject(rightBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY);
                    }
                    else {
                        // aim slightly off center of the player
                        this.physics.arcade.moveToXY(leftBullet, this.player.x - i * 100, this.player.y, BasicGame.ENEMY_BULLET_VELOCITY);
                        this.physics.arcade.moveToXY(rightBullet, this.player.x + i * 100, this.player.y, BasicGame.ENEMY_BULLET_VELOCITY);
                    }
                }
            }
        };
        Game.prototype.checkCollisions = function () {
            this.physics.arcade.overlap(this.bulletPool, this.enemyPool, this.enemyHit, null, this);
            this.physics.arcade.overlap(this.player, this.powerUpPool, this.playerPowerUp, null, this);
            if (this.bossApproaching === false) {
                this.physics.arcade.overlap(this.bulletPool, this.bossPool, this.enemyHit, null, this);
                this.physics.arcade.overlap(this.player, this.bossPool, this.playerHit, null, this);
            }
            this.physics.arcade.overlap(this.bulletPool, this.shooterPool, this.enemyHit, null, this);
            this.physics.arcade.overlap(this.player, this.enemyPool, this.playerHit, null, this);
            this.physics.arcade.overlap(this.player, this.shooterPool, this.playerHit, null, this);
            this.physics.arcade.overlap(this.player, this.enemyBulletPool, this.playerHit, null, this);
            this.physics.arcade.overlap(this.bulletPool, this.destroyerPool, this.enemyHit, null, this);
        };
        Game.prototype.playerPowerUp = function (player, powerUp) {
            this.addToScore(powerUp.reward);
            powerUp.kill();
            this.powerUpSFX.play();
            if (this.weaponLevel < 5) {
                this.weaponLevel++;
            }
        };
        Game.prototype.spawnEnemies = function () {
            if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
                this.nextEnemyAt = this.time.now + this.enemyDelay;
                var enemy = this.enemyPool.getFirstExists(false);
                //spawn at a random location tope of the screen
                //enemy.reset(this.rnd.integerInRange(20, this.game.width - 20), 0)
                enemy.reset(this.rnd.integerInRange(20, this.game.width - 20), 0, BasicGame.ENEMY_HEALTH);
                // also randomize the speed
                enemy.body.velocity.y = this.rnd.integerInRange(BasicGame.ENEMY_MIN_Y_VELOCITY, BasicGame.ENEMY_MAX_Y_VELOCITY);
                enemy.play('fly');
            }
            if (this.nextShooterAt < this.time.now && this.shooterPool.countDead() > 0) {
                this.nextShooterAt = this.time.now + this.shooterDelay;
                var shooter = this.shooterPool.getFirstExists(false);
                // spawn at a random location at the tope
                shooter.reset(this.rnd.integerInRange(20, this.game.width - 20), 0, BasicGame.SHOOTER_HEALTH);
                // choose a random target location at the bottom
                var target = this.rnd.integerInRange(20, this.game.width - 20);
                // move to target and rotate the sprite accordingly
                shooter.rotation = this.rnd.integerInRange(20, this.game.width - 20);
                // move to target and rotate the sprite accordingly
                shooter.rotation = this.physics.arcade.moveToXY(shooter, target, this.game.height, this.rnd.integerInRange(BasicGame.SHOOTER_MIN_VELOCITY, BasicGame.SHOOTER_MAX_VELOCITY)) - Math.PI / 2;
                shooter.play('fly');
                shooter.nextShotAt = 0;
            }
            if (this.nextDestroyerAt < this.time.now && this.destroyerPool.countDead() > 0) {
                this.nextDestroyerAt = this.time.now + this.destroyerDelay;
                var destroyer = this.destroyerPool.getFirstExists(false);
                destroyer.reset(this.rnd.integerInRange(20, this.game.width - 20), 0, BasicGame.SHOOTER_HEALTH);
                destroyer.body.velocity.y = this.rnd.integerInRange(BasicGame.ENEMY_MIN_Y_VELOCITY, BasicGame.ENEMY_MAX_Y_VELOCITY);
                destroyer.play('sail');
                destroyer.nextShotAt = 0;
            }
        };
        Game.prototype.processPlayerInput = function () {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -this.player.speed;
            }
            else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = this.player.speed;
            }
            if (this.cursors.up.isDown) {
                this.player.body.velocity.y = -this.player.speed;
            }
            else if (this.cursors.down.isDown) {
                this.player.body.velocity.y = this.player.speed;
            }
            if (this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15) {
                this.physics.arcade.moveToPointer(this.player, this.player.speed);
            }
            if (this.input.keyboard.isDown(Phaser.Keyboard.X)) {
                console.log('firebomb anyone?');
                this.fireBomb();
            }
            if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
                if (this.returnText && this.returnText.exists) {
                    this.quitGame();
                }
                else {
                    this.fire();
                }
            }
        };
        Game.prototype.fireBomb = function () {
            if (this.nextBombAt > this.time.now) {
                return;
            }
            this.nextBombAt = this.time.now + (Phaser.Timer.SECOND * 4);
            var bomb = this.bombs.getFirstAlive();
            if (bomb != null) {
                this.bombExplode();
                if (this.enemyPool.countLiving() > 0) {
                    this.enemyPool.forEachAlive(function (enemy) {
                        this.damageEnemy(enemy, BasicGame.BOMB_DAMAGE);
                    }, this);
                }
                if (this.shooterPool.countLiving() > 0) {
                    this.shooterPool.forEachAlive(function (shooter) {
                        this.damageEnemy(shooter, BasicGame.BOMB_DAMAGE);
                    }, this);
                }
                if (this.destroyerPool.countLiving() > 0) {
                    this.destroyerPool.forEachAlive(function (destroyer) {
                        this.damageEnemy(destroyer, BasicGame.BOMB_DAMAGE);
                    }, this);
                }
                bomb.kill();
            }
            else {
            }
        };
        Game.prototype.processDelayedEffects = function () {
            if (this.instructions.exists && this.time.now > this.instExpire) {
                this.instructions.destroy();
            }
            if (this.ghostUntil && this.ghostUntil < this.time.now) {
                this.ghostUntil = null;
                this.player.play('fly');
            }
            if (this.showReturn && this.time.now > this.showReturn) {
                this.returnText = this.add.text(this.game.width / 2, this.game.height / 2 + 20, 'Press Z or Tap Game to go back to Main Menu', { font: '16px sans-serif', fill: '#fff' });
                this.returnText.anchor.setTo(0.5, 0.5);
                this.showReturn = false;
            }
            if (this.bossApproaching && this.boss.y > 80) {
                this.bossApproaching = false;
                this.boss.nextShotAt = 0;
                this.boss.body.velocity.y = 0;
                this.boss.body.velocity.x = BasicGame.BOSS_X_VELOCITY;
                // allow bouncing off world bounds
                this.boss.body.bounce.x = 1;
                this.boss.body.collideWorldBounds = true;
            }
        };
        Game.prototype.fire = function () {
            if (!this.player.alive || this.nextShotAt > this.time.now) {
                return;
            }
            this.nextShotAt = this.time.now + this.shotDelay;
            this.playerFireSFX.play();
            var bullet;
            if (this.weaponLevel === 0) {
                if (this.bulletPool.countDead() === 0) {
                    return;
                }
                bullet = this.bulletPool.getFirstExists(false);
                bullet.reset(this.player.x, this.player.y - 20);
                bullet.body.velocity.y = -BasicGame.BULLET_VELOCITY;
            }
            else {
                if (this.bulletPool.countDead() < this.weaponLevel * 2) {
                    return;
                }
                for (var i = 0; i < this.weaponLevel; i++) {
                    bullet = this.bulletPool.getFirstExists(false);
                    // spawn left bullet slightly left off center
                    bullet.reset(this.player.x - (10 + i * 6), this.player.y - 20);
                    // the left bulelts spread from -95 degrrees to -135 degrees
                    this.physics.arcade.velocityFromAngle(-95 - i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity);
                    bullet = this.bulletPool.getFirstExists(false);
                    // spawn right bullet slightly right off center
                    bullet.reset(this.player.x + (10 + i * 6), this.player.y - 20);
                    // the right bullets spread from -85 degrees to -45
                    this.physics.arcade.velocityFromAngle(-85 + i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity);
                }
            }
        };
        Game.prototype.enemyHit = function () {
            bullet.kill();
            this.damageEnemy(enemy, BasicGame.BULLET_DAMAGE);
            this.damageEnemy(enemy, BasicGame.BULLET_DAMAGE);
        };
        Game.prototype.playerHit = function (player, enemy) {
            // Check first if this.ghostUntil is not not undefined or null
            if (this.ghostUntil && this.ghostUntil > this.time.now) {
                return;
            }
            this.playerExplosionSFX.play();
            // crashing into an enemy only deals 5 damage  
            this.damageEnemy(enemy, BasicGame.CRASH_DAMAGE);
            var life = this.lives.getFirstAlive();
            if (life != null) {
                life.kill();
                this.weaponLevel = 0;
                this.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
                this.player.play('ghost');
            }
            else {
                this.explode(player);
                player.kill();
                this.displayEnd(false);
            }
        };
        Game.prototype.damageEnemy = function (enemy, damage) {
            enemy.damage(damage);
            if (enemy.alive) {
                enemy.play('hit');
            }
            else {
                this.explode(enemy);
                this.explosionSFX.play();
                this.spawnPowerUp(enemy);
                this.addToScore(enemy.reward);
                // We check the sprite key (e.g. 'greenEnemy')
                if (enemy.key === 'boss') {
                    this.enemyPool.destroy();
                    this.shooterPool.destroy();
                    this.bossPool.destroy();
                    this.enemyBulletPool.destroy();
                    this.displayEnd(true);
                }
            }
        };
        Game.prototype.spawnPowerUp = function (enemy) {
            if (this.powerUpPool.countDead() === 0 || this.weaponLevel === 5) {
                return;
            }
            if (this.rnd.frac() < enemy.dropRate) {
                var powerUp = this.powerUpPool.getFirstExists(false);
                powerUp.reset(enemy.x, enemy.y);
                powerUp.body.velocity.y = BasicGame.POWERUP_VELOCITY;
            }
        };
        Game.prototype.addToScore = function (score) {
            this.score += score;
            this.scoretText.text = this.score;
            if (this.score >= 20000 && this.bossPool.countDead() == 1) {
                this.spawnBoss();
            }
        };
        Game.prototype.spawnBoss = function () {
            this.bossApproaching = true;
            this.boss.reset(this.game.width / 2, 0, BasicGame.BOSS_HEALTH);
            this.physics.enable(this.boss, Phaser.Physics.ARCADE);
            this.boss.body.velocity.y = BasicGame.BOSS_Y_VELOCITY;
            this.boss.play('fly');
        };
        Game.prototype.displayEnd = function () {
            // you can't win and lose at the same time
            if (this.endText && this.endText.exists) {
                return;
            }
            var msg = win ? 'You Win!!!' : 'Game Over!';
            this.endText = this.add.text(this.game.width / 2, this.game.height / 2 - 60, msg, { font: '72px serif', fill: '#fff' });
            this.endText.anchor.setTo(0.5, 0);
            this.showReturn = this.time.now + BasicGame.RETURN_MESSAGE_DELAY;
        };
        Game.prototype.quitGame = function (pointer) {
            // you can't win and lose at the same time
            if (this.endText && this.endText.exists) {
                return;
            }
            var msg = win ? 'You Win!!!' : 'Game Over!';
            this.endText = this.add.text(this.game.width / 2, this.game.height / 2 - 60, msg, { font: '72px serif', fill: '#fff' });
            this.endText.anchor.setTo(0.5, 0);
            this.showReturn = this.time.now + BasicGame.RETURN_MESSAGE_DELAY;
        };
        return Game;
    }(Phaser.State));
    JetFire.Game = Game;
})(JetFire || (JetFire = {}));
/// <reference path="../src/game.ts"/>
var JetFire;
(function (JetFire) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.call(this);
        }
        MainMenu.prototype.create = function () {
            // add the 'logo' sprite to the game, position it in the
            // center of the screen, and set the anchor to the center of
            // the image so it's centered properly. There's a lot of
            // centering in that last sentence
            this.add.sprite(0, 0, 'titlepage');
            this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 80, "Press Z or tap/click game to start", { font: "20px monospace", fill: "#fff" });
            this.loadingText.anchor.setTo(0.5, 0.5);
            this.add.text(this.game.width / 2, this.game.height - 90, "image assets Copyright (c) 2002 Ari Feldman", { font: "12px monospace", fill: "#fff", align: "center" }).anchor.setTo(0.5, 0.5);
            this.add.text(this.game.width / 2, this.game.height - 75, "sound assets Copyright (c) 2012 - 2013 Devin Watson", { font: "12px monospace", fill: "#fff", align: "center" }).anchor.setTo(0.5, 0.5);
        };
        MainMenu.prototype.update = function () {
            if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
                this.startGame();
            }
        };
        MainMenu.prototype.startGame = function () {
            this.game.state.start('Game');
        };
        return MainMenu;
    }(Phaser.State));
    JetFire.MainMenu = MainMenu;
})(JetFire || (JetFire = {}));
/// <reference path="../src/game.ts"/>
var JetFire;
(function (JetFire) {
    var PreLoader = (function (_super) {
        __extends(PreLoader, _super);
        function PreLoader() {
            _super.call(this);
        }
        PreLoader.prototype.preload = function () {
            this.stage.backgroundColor = '#2d2d2d';
            this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
            this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);
        };
        PreLoader.prototype.create = function () {
            // add the 'logo' sprite to the game, position it in the
            // center of the screen, and set the anchor to the center of
            // the image so it's centered properly. There's a lot of
            // centering in that last sentence
            this.game.state.start('MainMenu');
        };
        return PreLoader;
    }(Phaser.State));
    JetFire.PreLoader = PreLoader;
})(JetFire || (JetFire = {}));
//# sourceMappingURL=game.js.map