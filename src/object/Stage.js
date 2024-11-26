import { 
  Scene, 
  Color, 
  WebGLRenderer, 
  Mesh, 
  PlaneGeometry, 
  AxesHelper, 
  ShadowMaterial, 
  AmbientLight, 
  DirectionalLight, 
  OrthographicCamera, 
  BoxHelper, 
  Vector2 ,
  TextureLoader

} from 'three';
import * as THREE from 'three';  // 导入整个 THREE 库，或者你可以单独导入必要的类
import { parseGIF, decompressFrames } from 'gifuct-js'; // 引入 gifuct-js
import {
  BACKGROUND_COLOR,
  DEV,
  WIDTH,
  HEIGHT,
  CLIENT_HEIGHT,
  CLIENT_WIDTH,
  FAR,
  LIGHT_COLOR,
  ORBIT_CONTROL,
  ENABLE_IMAGE_POST_PROCESS
} from '../config/constant';

// DEBUG 时候用的视角控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 残影效果插件（该方案被 PASS）
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

import Stats from 'stats.js';

export default class Stage {

  constructor () {
    // 场景
    this.scene = null;
    // 地面
    this.plane = null;
    // 光照
    this.shadowLight = null;
    // 相机
    this.camera = null;
    // 渲染器
    this.renderer = null;
    // 合成特效
    this.composer = null;
    // 性能监控
    this.stats = null;

    this.init();
  }

  init() {
    // 初始化场景
    this.createScene();
    // 初始化渲染器
    this.createRenderer();
    // 初始化地面
    this.createPlane();
    // 初始化光照
    this.createLight();
    // 初始化相机
    this.createCamera();

    if (DEV) {
      // 初始化性能监控器
      this.createStats();
    }
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.updateMatrixWorld(true);
  
    // Create a video element
    const video = document.createElement('video');
    video.src = '/1.mp4'; // Your video path
    video.load();
  
    // Mute the video to allow autoplay
    video.muted = true;
  
    // Wait until the video can play
    video.oncanplay = () => {
      // Start playing the video once it's ready
      video.play();
      video.loop = true; // Loop the video if needed
  
      // Create a video texture
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;  // To ensure smooth rendering
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat; // Use RGB format for video texture
  
      // Set the video texture as the background of the scene
      this.scene.background = videoTexture;
  
      if (DEV) {
        // Add axis helper if in development mode
        this.scene.add(new THREE.AxesHelper(FAR));
      }
  
      // Update video texture in the render loop
      this.videoTexture = videoTexture;
    };
  
    // Optionally handle errors in case the video doesn't load properly
    video.onerror = (error) => {
      console.error('Error loading video:', error);
    };
  }
  
  


  


  // 地面
  createPlane () {
    // 创建一个足够大的地面
    // 由于视角是 45 度向下看，地面会比实际的大，这里简单处理下
    const geometry = new PlaneGeometry(2 * FAR, 2 * FAR, 1, 1);
    // ShadowMaterial 阴影材质, 此材质可以接收阴影
    // transparent： 透明，在非透明对象之后渲染
    // opacity: 透明度
    const material = new ShadowMaterial({ transparent: true, opacity: 0.5});

    this.plane = new Mesh(geometry, material);
    // 接收阴影
    this.plane.receiveShadow = true;

    // 旋转 -90，此时地面处在 x-z 平面
    this.plane.rotation.x = -Math.PI / 2;

    if (DEV) {
      const box = new BoxHelper( this.plane );
      this.scene.add( box );
    }

    this.scene.add(this.plane)
  }

  // 光源
  createLight() {
    // 环境光会均匀的照亮场景中的所有物体，它不能用来投射阴影，因为它没有方向
    const ambientLight = new AmbientLight(LIGHT_COLOR, 0.5);

    // 平行光，平行光可以投射阴影
    this.shadowLight = new DirectionalLight(LIGHT_COLOR, 0.5);
    // 设定光照源方向，目标默认是原点
    // 这个大小无意义，只代表方向
    this.shadowLight.position.set(FAR/6, FAR/2, FAR/6);
    // 开启阴影投射
    this.shadowLight.castShadow = true;

    // 定义可见域的投射阴影
    this.shadowLight.shadow.camera = new OrthographicCamera(-WIDTH*1.5, WIDTH*1.5, HEIGHT, -HEIGHT, 0, 2 * FAR);
    this.shadowLight.shadow.mapSize = new Vector2( 1024, 1024 );

    this.scene.add(ambientLight);
    this.scene.add(this.shadowLight);
  }

  // 相机
  createCamera () {
    // 相机使用正交相机
    // 相机是椎体的宽度和高度尽量和界面大小一致
    this.camera = new OrthographicCamera(-WIDTH/2, WIDTH/2, HEIGHT/2, -HEIGHT/2, -FAR/4, FAR*2);

    if (DEV && ORBIT_CONTROL) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.autoRotate = true;
    }

    // 相机位置超过最大物体
    // 斜向右下看
    this.camera.position.set(-FAR/2, FAR/2, FAR/2);
    this.camera.lookAt(0, 0, 0);

    if (ENABLE_IMAGE_POST_PROCESS) {
      // 相机添加到 composer
      this.composer.addPass(new RenderPass(this.scene, this.camera));

      const afterimagePass = new AfterimagePass();
      this.composer.addPass(afterimagePass);
    }

  }

  // 性能监控
  createStats() {
    this.stats = new Stats();
    //设置统计模式
    // 0: fps, 1: ms, 2: mb, 3+: custom
    this.stats.showPanel(0);

    //将统计对象添加到 body 元素中
    document.body.appendChild(this.stats.dom);
  }

  // 渲染器
  createRenderer () {
    this.renderer = new WebGLRenderer({
      antialias:true // 抗锯齿
    });
    this.renderer.setSize(CLIENT_WIDTH, CLIENT_HEIGHT);
    document.body.appendChild(this.renderer.domElement );
    // 开启阴影
    this.renderer.shadowMap.enabled = true;
    // 设置设备像素
    this.renderer.setPixelRatio(window.devicePixelRatio);

    if (ENABLE_IMAGE_POST_PROCESS) {
      // 开启特效
      this.composer = new EffectComposer(this.renderer);
    }
  }


  render() {
  const { scene, camera, renderer, composer, stats, videoTexture } = this;

  function animate() {
    if (DEV) {
      stats.begin();
    }

    // 确保每一帧更新视频纹理
    if (videoTexture) {
      videoTexture.needsUpdate = true;
    }

    if (ENABLE_IMAGE_POST_PROCESS) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }

    if (DEV) {
      stats.end();
    }

    // 请求下一帧
    requestAnimationFrame(animate);
  }

  if (DEV && ORBIT_CONTROL) {
    animate();
  } else {
    if (DEV) {
      stats.begin();
    }

    // 确保每一帧更新视频纹理
    if (videoTexture) {
      videoTexture.needsUpdate = true;
    }

    if (ENABLE_IMAGE_POST_PROCESS) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }

    if (DEV) {
      stats.end();
    }
  }
}

  
}
