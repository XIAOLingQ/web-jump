import { Group } from 'three';
import TWEEN from '@tweenjs/tween.js';
import CubeBox from './CubeBox';
import CylinderBox from './CylinderBox';
import ExpressBox from './ExpressBox'; // 盒子
import MagicCubeBox from './MagicCubeBox'; // 转动
import { animateFrame } from '../util/TweenUtil';
import { FAR, ENABLE_DISPOSE_BOX } from "../config/constant";
import * as THREE from 'three';

const BoxList = [{
  index: 0,
  box: CubeBox,
  isStatic: false
}, {
  index: 1,
  box: CylinderBox,
  isStatic: false
}, {
  index: 2,
  box: ExpressBox,
  isStatic: true
}, {
  index: 3,
  box: MagicCubeBox,
  isStatic: true
}];

export default class BoxGroup {

  constructor() {
    // 最后一个盒子
    this.last = null;
    // 存放盒子组
    this.group = new Group();
    // 保存一个小人的引用
    this.littleMan = null;
    // 存放盒子的缓存
    this.boxInstance = {};
    this.jumpGame = null;

    // 初始化静态盒子
    this.boxInstance[2] = new ExpressBox(null).mesh;
    this.boxInstance[3] = new MagicCubeBox(null).mesh;
  }

  getBoxInstance(index) {
    const boxObject = BoxList[index];

    if (boxObject.isStatic) {
      if (this.boxInstance[index]) {
        return new boxObject.box(this.last, this.boxInstance[index]);
      } else {
        const box = new boxObject.box(this.last);
        this.boxInstance[index] = box.mesh.clone();
        return box;
      }
    } else {
      return new boxObject.box(this.last);
    }
  }

  // 创建一个盒子
  createBox() {
    let box;

    if (!this.last || !this.last.prev) {
      box = new CubeBox(this.last);
    } else {
      const randomValue = Math.random();
      const index = randomValue < 1 ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 2); // 70%几率抽取2或3，30%几率抽取0或1
      box = this.getBoxInstance(index);
    }

    this.group.add(box.mesh);
    this.last = box;

    return this.last;
  }

  // 更新位置
  updatePosition({
    duration,
  }) {
    // 找到最后两个盒子的中点
    const last = this.last;
    const secondOfLast = last.prev;
    const centerX = 0.5 * (last.position.x + secondOfLast.position.x);
    const centerZ = 0.5 * (last.position.z + secondOfLast.position.z);

    let lastX = 0;
    let lastZ = 0;

    // 先记录下小人最终的目的地，因为可能在盒子未移动完成之前，小人点击了跳跃
    if (this.littleMan) {
      const { x, z } = this.littleMan.body.position;
      this.littleMan.body.finalX = x - centerX;
      this.littleMan.body.finalZ = z - centerZ;
    }

    // 配置动画参数并开始
    new TWEEN.Tween({ x: 0, z: 0 })
      .to({ x: centerX, z: centerZ }, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(({ x, z }) => {
        const deltaX = x - lastX;
        const deltaZ = z - lastZ;

        // 更新盒子
        this.updateBoxPositionInChain(deltaX, deltaZ);
        // 更新小人
        this.updateLittleMan(deltaX, deltaZ);

        lastX = x;
        lastZ = z;
      })
      .start();

    animateFrame();
  }

  updateBoxPositionInChain(deltaX, deltaZ) {
    let tail = this.last;
    const boxToDisPose = [];
  
    while (tail) {
      const { x, z } = tail.position;
      const position = {
        x: x - deltaX,
        z: z - deltaZ
      };
  
      if (ENABLE_DISPOSE_BOX) {
        if (position.x > 2 * FAR || position.z > 2 * FAR) {
          boxToDisPose.push(tail);
        } else {
          tail.updateXZPosition(position);
        }
      } else {
        tail.updateXZPosition(position);
      }
  
      tail = tail.prev;
    }
  
    if (ENABLE_DISPOSE_BOX) {
      boxToDisPose.forEach((box, index) => {
        if (box.next) {
          box.next.prev = null;
        }
        box.prev = null;
        box.next = null;
  
        // 确保 box.mesh 存在且是 THREE.Mesh 对象
        if (box.mesh) {
          console.log(`Box ${index} mesh exists:`, box.mesh);
  
          // 检查 box.mesh 是否为 THREE.Mesh 类型
          if (box.mesh instanceof THREE.Mesh) {
            // 清理几何体
            if (box.mesh.geometry) {
              box.mesh.geometry.dispose();
            }
  
            // 清理材质
            if (box.mesh.material) {
              if (Array.isArray(box.mesh.material)) {
                box.mesh.material.forEach((material) => {
                  if (material instanceof THREE.Material) {
                    material.dispose();
                  }
                });
              } else if (box.mesh.material instanceof THREE.Material) {
                box.mesh.material.dispose();
              }
            }
  
            // 最后清理 mesh
            //box.mesh.dispose();
          } else {
            console.warn(`Box ${index} mesh is not a valid THREE.Mesh object.`);
          }
        } else {
          console.warn(`Box ${index} does not have a mesh.`);
        }
  
        // 从数组中移除 box
        boxToDisPose.splice(index, 1);
      });
    }
  }
  
  
  
  updateLittleMan(deltaX, deltaZ) {
    if (this.littleMan) {
      this.littleMan.body.translateX(-deltaX);
      this.littleMan.body.translateZ(-deltaZ);
    }
  }

  // 加入场景
  enterStage(stage) {
    stage.scene.add(this.group);
  }

  setLittleMan(littleMan) {
    this.littleMan = littleMan;
  }

  setJumpGame(jumpGame) {
    this.jumpGame = jumpGame;
  }
}
