import './style.css';
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';
await document.fonts.load('15px jalnan', '123456789score');
await document.fonts.load('15px ONEMobilePOP', '123456789score');
new Phaser.Game({
  type: Phaser.WEBGL, // Phaser.CANVAS 해도 되지만 WEBGL이 성능이 더 좋음
  width: '100%',
  height: '100%',
  physics: {   // 물리엔진과 관련한 설정
    default: 'arcade',
    arcade: {
      debug: import.meta.env.DEV,  // develop 모드일 때만 true
      gravity: { y: 2500 } // 중력
    }
  },
  scene: [MainScene] // 배열로 scene 넣음. 여기에 넣으면 인스턴스 만들어짐 맨 처음 scene부터 생명주기 타기 시작함
})