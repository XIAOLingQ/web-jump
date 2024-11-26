import Stage from './Stage';
import BoxGroup from './BoxGroup';
import LittleMan from './LittleMan';
import {setFrameAction} from '../util/TweenUtil';

export default class JumpGame {

  constructor () {
    // 舞台
    this.stage = null;
    // 盒子组
    this.boxGroup = null;
    // 小人
    this.littleMan = null;
    // 游戏初始化
    this.init();
  }

  init() {
    // 初始化舞台
    this.stage = new Stage();
    // 初始化盒子
    this.initBoxes();
    // 初始化小人
    this.initLittleMan();
    // 将当前 JumpGame 实例设置到 boxGroup
    this.boxGroup.setJumpGame(this);
    // 每次动画后都要渲染
    setFrameAction(this.stage.render.bind(this.stage));
  }

  initBoxes() {
    this.boxGroup = new BoxGroup();

    // 初始化首个盒子
    this.boxGroup.createBox();
    // 初始化第二个盒子
    this.boxGroup.createBox();
    // 盒子加入场景
    this.boxGroup.enterStage(this.stage);
  }

  initLittleMan() {
    // 小人初始化
    this.littleMan = new LittleMan(this.stage, this.boxGroup);
    // 将小人给盒子一份，方便盒子移动时候带上小人
    this.boxGroup.setLittleMan(this.littleMan);
    // 加入舞台
    this.littleMan.enterStage(this.stage);

    // 更新盒子和小人的位置
    this.boxGroup.updatePosition({
      duration: 0
    });
  }

  start() {
    this.stage.render();
  }

  // 添加重新开始游戏的方法
  restart() {
    location.reload();
  }

  // 在游戏结束时调用
  showRestartButton() {
    console.log('游戏结束，当前状态:');
    const button = document.createElement('button');
    button.innerText = '重新开始';
    button.style.position = 'absolute';
    button.style.top = '50%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.fontSize = '20px';
    button.style.padding = '10px 20px';
    button.onclick = () => {
      this.restart();
      document.body.removeChild(button); // 移除按钮
    };
    document.body.appendChild(button);
  }

  // 添加处理游戏结束的方法
  handleGameOver(state) {
    console.log('游戏结束处理:', state);
    // 在这里添加游戏结束时的逻辑，例如显示重启按钮
    this.showRestartButton();
  }

}
