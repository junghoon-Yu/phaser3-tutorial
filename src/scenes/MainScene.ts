export default class MainScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    circle!: Phaser.GameObjects.Arc;
    minimap!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.TileSprite;
    player: any;
    platform: any;
    platformGroup!: Phaser.Physics.Arcade.StaticGroup;
    platformGroup2: any;
    camera: any;
    floor: any;
    correct: any;
    enemyGroup!: Phaser.Physics.Arcade.Group;
    constructor() {
        super({ key: 'main' });
    }
    // init(){
    //     console.log('init')
    // }
    preload() {
        // this.load.tilemapTiledJSON('map');
        // this.load.image('tile', 'tile.png', {frameWidth: 70, frameHeight: 70});
        // this.load.image('ground', 'map/kenny_ground_64x64.png');
        // this.load.image('items', 'map/kenny_items_64x64.png');
        // this.load.image('platformer', 'map/kenny_platformer_64x64.png');

        // this.load.tilemapTiledJSON('map', 'map/map.json');

        this.load.image('background', 'clouds-h.png');

        this.load.image('cloud-platform', 'cloud-platform.png');

        this.load.image('coin', 'goldstar.webp');
        this.load.atlas('beji', 'player/beji.png', 'player/beji.json');
        this.load.atlas('bee', 'bee/bee.png', 'bee/bee.json');
    }

    create() {
        const { width, height } = this.game.canvas;
        // const map = this.make.tilemap({ key: 'map' });

        // var groundTiles = map.addTilesetImage('kenny_ground_64x64', 'ground');
        // var itemTiles = map.addTilesetImage('kenny_items_64x64', 'items');
        // var platformTiles = map.addTilesetImage('kenny_platformer_64x64', 'platformer');
        // map.createLayer('Tile Layer 1', [ groundTiles, itemTiles, platformTiles ]);
        // const tileset = map.addTilesetImage('tile', 'tile');
        // const platforms = map.createLayer('platforms', tileset);

        this.floor = this.add.rectangle(0, 0, width, height, 0xffffff).setOrigin(0, 0);
        this.background = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0, 0).setScrollFactor(0);

        // this.background.fixedToCamera = true;

        this.player = this.add.sprite(width / 2, 0, 'beji', 'stand1');
        this.player.setScale(0.5);

        this.player.anims.create({
            key: 'stand',
            frames: this.anims.generateFrameNames('beji', {
                prefix: 'stand',
                start: 1,
                end: 5
            }),
            repeat: -1,
            frameRate: 4
        });
        this.player.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('beji', {
                prefix: 'walk',
                start: 1,
                end: 6
            }),
            repeat: -1,
            frameRate: 8
        });

        this.player.play('stand');

        this.physics.add.existing(this.player); // 물리 엔진에 넣어줌

        // this.physics.add.staticGroup(this.floor); // 움직이지 않는 요소
        const platform1 = this.add.rectangle(width / 2, 250, 300, 30, 0xff0000);
        const text1 = this.add
            .text(width / 2, 250, 'start', { color: '#ffff00', fontSize: '24px', fontFamily: 'ONEMobilePOP' })
            .setOrigin(0.5);
        const platform2 = this.add.rectangle(100, 400, 150, 30, 0xff0000);
        const text2 = this.add
            .text(100, 400, 'test', { color: '#ffff00', fontSize: '24px', fontFamily: 'ONEMobilePOP' })
            .setOrigin(0.5);
        const platform3 = this.add.rectangle(width - 100, 550, 200, 30, 0xff0000);
        const platform4 = this.add.rectangle(200, 700, 300, 30, 0xff0000);
        this.platformGroup = this.physics.add.staticGroup(); // 움직이지 않는 요소
        this.platformGroup2 = this.physics.add.group({
            collideWorldBounds: true,
            allowGravity: false,
            immovable: true
        });
        this.tweens.add({
            targets: platform2,
            x: width - 100,
            duration: 4000,
            yoyo: true,
            repeat: -1
            // delay:Phaser.Math.Between(0, 1000)
        });
        this.tweens.add({
            targets: text2,
            x: width - 100,
            duration: 4000,
            yoyo: true,
            repeat: -1
            // delay:Phaser.Math.Between(0, 1000)
        });

        this.tweens.add({
            targets: platform3,
            x: 0,
            duration: Phaser.Math.Between(3, 5) * 1000,
            yoyo: true,
            repeat: -1
            // delay:Phaser.Math.Between(0, 1000)
        });
        this.platformGroup.add(platform1);
        this.platformGroup.add(text1);
        this.platformGroup2.add(platform2);
        this.platformGroup2.add(text2);
        this.platformGroup2.add(platform3);
        this.platformGroup.add(platform4);

        this.physics.add.collider(this.player, this.platformGroup2);

        // reaward
        const rewards = this.physics.add.group({
            allowGravity: false
        });
        this.time.addEvent({
            startAt: 0,
            delay: 2000,
            repeat: -1,
            callback: () => {
                if (this.floor.y < 2000) return;
                const _x = Phaser.Math.Between(10, width - 10);
                const _y = this.floor.y + height / 2;
                rewards.add(this.physics.add.image(_x, _y, 'coin').setScale(0.2).setDepth(2));
            }
        });

        this.physics.add.overlap(this.player, rewards, (player, reward) => {
            reward.destroy();
            rewards.remove(reward);
            //score +=1;
        });

        // enemy
        this.enemyGroup = this.physics.add.group({
            allowGravity: false
        });
        const enemy = this.add.sprite(width, 600, 'bee', 'walk1');
        enemy.setScale(0.4);
        enemy.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('bee', {
                prefix: 'walk',
                start: 1,
                end: 2
            }),
            repeat: -1,
            frameRate: 4
        });
    
        this.enemyGroup.add(enemy);
        enemy.body.velocity.x = -300;

        const a = this.physics.add.overlap(this.player, this.enemyGroup, (player, enemy) => {
            // this.enemyGroup.remove(enemy);
            // enemy.destroy();
            // this.scene.pause();
            //score +=1;
            console.log('aa');
            // a.active = false;
            this.enemyGroup.remove(enemy);
            setTimeout(() => {
                enemy.destroy();
            }, 5000)
            // enemy.setActive(false);
            // enemy.disableInteractive();
            // enemy.active = false;
            
        });


        // platform 랜덤 생성
        this.time.addEvent({
            startAt: 0,
            delay: 2000,
            repeat: -1,
            callback: () => {
                if (this.floor.y < height / 2) return;

                const _w = Phaser.Math.Between(200, 300);
                const _x = Phaser.Math.Between(_w / 2, width - _w / 2);
                const _y = this.floor.y + height / 2 + Phaser.Math.Between(-20, 20);

                const _randomNum = this.correct === 0 ? 1 : [0, 1, 1][Phaser.Math.Between(0, 2)];
                const _newPlatform = this.add.rectangle(_x, _y, _w, 30, _randomNum === 1 ? 0xff0000 : 0xffffff);
                const _newText = this.add
                    .text(_x, _y, _randomNum === 1 ? '정답' : '오답', {
                        color: _randomNum === 1 ? '#ffff00' : '#000000',
                        fontSize: '24px',
                        fontFamily: 'ONEMobilePOP'
                    })
                    .setOrigin(0.5);
                if (_randomNum === 1) {
                    // 정답일 때
                    this.correct = 1;
                    this.platformGroup.add(_newPlatform);
                    this.platformGroup.add(_newText);
                } else {
                    // 오답일 때
                    this.correct = 0;
                    const _newG = this.physics.add.staticGroup();
                    _newG.add(_newPlatform);
                    _newG.add(_newText);
                    this.physics.add.collider(this.player, _newG, () => {
                        _newG.physicsType = 0;
                        _newG.setVisible(false);
                    });
                }
            }
        });

        this.physics.add.collider(this.player, this.platformGroup);

        // 키보드
        this.cursors = this.input.keyboard.createCursorKeys();
        // 카메라 설정
        this.cameras.main.startFollow(this.floor);
        this.cameras.main.setBounds(0, 0, width, height);

        // 카메라 영향 안받는 obj - score
        this.add.rectangle(10, 10, 100, 50, 0xff0000).setOrigin(0, 0).setScrollFactor(0);
    }
    update(time: number, delta: number): void {
        // this.background.tilePositionY += 1; // 화면 아래로
        this.floor.y += 2;
        // this.platformGroup.incY(-1);
        this.cameras.main.setBounds(0, 0, this.game.canvas.width, this.game.canvas.height + this.floor.y);
        // console.log(this.platformGroup)
        // this.physics.add.collider(this.player, this.platformGroup);
        // this.floor.setY(this.background.tilePositionY)
        if (this.cursors.left.isDown) {
            //  왼쪽 키 눌렸으면
            this.player.setFlipX(true);
            this.player.body.velocity.x = -200;
            this.player.play('walk', true);
        } else if (this.cursors.right.isDown) {
            this.player.setFlipX(false);
            this.player.play('walk', true);
            this.player.body.velocity.x = 200;
        } else {
            this.player.play('stand', true);
            this.player.body.velocity.x = 0;
        }
        if (this.cursors.space.isDown) {
            this.player.body.velocity.y = -500;
        }

        // 게임 종료
        if (this.cameras.main.worldView.y > 0) {
            if (this.player.y + this.player.height < this.cameras.main.worldView.y) {
                this.scene.pause();
                // this.scene.stop()
            }
            if (
                this.player.y - this.player.height >
                this.cameras.main.worldView.y + this.cameras.main.worldView.height
            ) {
                this.scene.pause();
                // this.scene.stop()
            }
        }

        //
        this.enemyGroup.children.iterate(el => {
            if (el.body.position.x < 0) {
                setTimeout(() => {
                    el.destroy();
                    this.enemyGroup.remove(el);
                });
            }
        });

        // this.minimap.scrollX = this.circle.x;
        // this.minimap.scrollY = this.circle.y;
    }
}
