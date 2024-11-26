import Box from './Box';
import {BoxGeometry, Mesh, MeshLambertMaterial, TextureLoader} from "three";
import {recreateCubeUV, LEFT, TOP, BEHIND} from '../util/MapUtil';
import express1 from '../res/宙斯/1.png';
import express2 from '../res/宙斯/2.png';
import express3 from '../res/宙斯/3.png';
import express4 from '../res/宙斯/4.png';
import express5 from '../res/维纳斯/1.png';
import express6 from '../res/维纳斯/3.png';
import express7 from '../res/维纳斯/4.png';
import express8 from '../res/维纳斯/5.png';
export default class ExpressBox extends Box {
  constructor(prev) {
    super(prev)
  }

  initBox() {
    const geometry = new BoxGeometry(25, this.height, 25);
    const material = new MeshLambertMaterial({
      map: new TextureLoader().load(this.getRandomExpress()),
    });

    geometry.translate(0, this.height/2, 0);

    // 裁剪贴图
    recreateCubeUV(428, 428, geometry, LEFT, 0, 0, 280, 148);
    recreateCubeUV(428, 428, geometry, TOP, 0, 428, 280, 148);
    recreateCubeUV(428, 428, geometry, BEHIND, 280, 148, 428, 428, true);

    // 生成网格
    this.mesh = new Mesh(geometry, material);
  }

  getRandomExpress() {
    const expressImages = [express1, express2, express3, express4, express5, express6, express7, express8];
    
    // 洗牌算法
    for (let i = expressImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [expressImages[i], expressImages[j]] = [expressImages[j], expressImages[i]];
    }

    const randomIndex = Math.floor(Math.random() * expressImages.length);
    return expressImages[randomIndex];
  }

}
