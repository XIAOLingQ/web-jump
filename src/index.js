import JumpGame from './object/JumpGame';
import './index.css';

class GameManager {
  constructor() {
    this.music = new Audio('/music/relaxing-music.mp3');
    this.music.loop = true;
    this.music.volume = 0.8;
    this.game = null;
    this.setupAudioButton();
  }

  setupAudioButton() {
    // 创建一个开始游戏的按钮
    const startButton = document.createElement('button');
    startButton.innerHTML = '点击开始游戏';
    startButton.style.position = 'absolute';
    startButton.style.top = '50%';
    startButton.style.left = '50%';
    startButton.style.transform = 'translate(-50%, -50%)';
    startButton.style.padding = '15px 30px';
    startButton.style.fontSize = '20px';
    startButton.style.cursor = 'pointer';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    // 添加hover效果
    startButton.onmouseover = () => {
      startButton.style.backgroundColor = '#45a049';
    };
    startButton.onmouseout = () => {
      startButton.style.backgroundColor = '#4CAF50';
    };

    // 点击按钮时启动游戏和音乐
    startButton.addEventListener('click', () => {
      this.startGame();
      startButton.remove(); // 移除按钮
    });

    document.body.appendChild(startButton);
  }

  startGame() {
    // 播放音乐
    this.music.play().catch(error => {
      console.warn('音乐播放失败:', error);
    });

    // 启动游戏
    this.game = new JumpGame();
    this.game.start();

    // 创建文字说明
    this.createTextInfo();
  }

  createTextInfo() {
    const textDiv = document.createElement('div');
    textDiv.innerHTML = `
      编程与艺术课程作业<br>
      建议用电脑打开<br>
      背景是动图<br>
      但是，由于带宽限制网页加载可能较慢<br>
      游戏运行过程中可能会有报错，直接叉掉<br>
      老师有问题请联系我, Q:3061784569<br>
      <a href="https://share.weiyun.com/vektcOdy" target="_blank" style="color: red; text-decoration: underline;">视频演示为本地运行真实效果(就狠点！)</a><br>
      GitHub地址：<a href="https://github.com/XIAOLingQ/web-jump" target="_blank" style="color: red; text-decoration: underline;">部署方法和演示(就狠点！)</a><br>
      Gitee地址：<a href="https://gitee.com/xiaolq1/web-jump" target="_blank" style="color: red; text-decoration: underline;">部署方法和演示(就狠点！)</a><br>
    `;

    textDiv.style.position = 'absolute';
    textDiv.style.top = '20px';
    textDiv.style.left = '20px';
    textDiv.style.fontSize = '24px';
    textDiv.style.color = 'black';
    textDiv.style.fontWeight = 'bold';
    textDiv.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    textDiv.style.whiteSpace = 'pre-line';

    document.body.appendChild(textDiv);
  }
}

// 初始化游戏管理器
window.addEventListener('DOMContentLoaded', () => {
  new GameManager();
});