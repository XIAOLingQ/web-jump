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
import express9 from '../res/毕加索/1.png';
import express10 from '../res/毕加索/2.png';
import express11 from '../res/毕加索/3.png';
import express12 from '../res/毕加索/4.png';
import express13 from '../res/梵高/1.png';
import express14 from '../res/梵高/2.png';
import express15 from '../res/梵高/3.png';
import express16 from '../res/梵高/4.png';
import express17 from '../res/野兽派/1.png';
import express18 from '../res/野兽派/2.png';
import express19 from '../res/野兽派/3.png';
import express20 from '../res/野兽派/4.png';
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
    const expressImages = [express1, express2, express3, express4, express5, express6, express7, express8,express9,express10,express11,express12,express13,express14,express15,express16,express17,express18,express19,express20];
    
    // 洗牌算法
    for (let i = expressImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [expressImages[i], expressImages[j]] = [expressImages[j], expressImages[i]];
    }

    const randomIndex = Math.floor(Math.random() * expressImages.length);
    return expressImages[randomIndex];
  }

}
