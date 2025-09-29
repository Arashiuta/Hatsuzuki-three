import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import type { BaseConfig, SceneOption } from "./types";
import { OutputPass, SMAAPass } from "three/examples/jsm/Addons.js";
import { FXAAPass } from "three/examples/jsm/postprocessing/FXAAPass.js";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

class Base {
  container: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  clock: THREE.Clock;
  autoShadow: boolean; //自动阴影
  resize: boolean; // 是否自动调整大小
  animationFrameId: number | null; // 用于存储requestAnimationFrame的ID

  animateFuncMap: Map<string, () => void> = new Map(); // 存储动画运行函数的对象
  disposeFuncMap: Map<string, () => void> = new Map(); //用于存储卸载函数的对象
  composerPassMap: Map<string, any> = new Map(); //用于存储后处理通道的对象

  constructor(config?: BaseConfig) {
    const {
      container = "#Space",
      autoShadow = false,
      resize = true,
      antialias = "SMAA",
    } = config || {};
    this.container =
      container instanceof HTMLElement
        ? container
        : (document.querySelector(container) as HTMLElement);
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.resize = resize;
    this.autoShadow = autoShadow;

    //创建默认相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      200
    );
    this.camera.position.set(...[50, 50, 50]);
    this.camera.lookAt(0, 0, 0);

    // 创建WebGL渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: antialias === "MSAA" ? true : false, // 启用抗锯齿
      alpha: true, // 启用透明背景
    });
    // 设置渲染尺寸为容器大小
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    // 设置设备像素比(提高在高DPI设备上的渲染质量)
    this.renderer.setPixelRatio(window.devicePixelRatio);

    if (autoShadow) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用软阴影
    }

    // --- 默认使用 EffectComposer ---
    this.composer = new EffectComposer(this.renderer);
    this.updateComposerRenderPass();
    // 添加抗锯齿
    if (antialias === "SMAA") {
      this.composer.addPass(new SMAAPass());
    }
    if (antialias === "FXAA") {
      this.composer.addPass(new FXAAPass());
    }
    // 在后处理通道链的最后添加一个 OutputPass
    this.composer.addPass(new OutputPass());

    this.animationFrameId = null; // 初始化动画帧ID为null

    //启动渲染
    this.start();
  }

  //启动
  start() {
    // 将渲染器添加到容器中
    this.container.appendChild(this.renderer.domElement);
    // 开始渲染循环
    this.animate();

    if (this.resize) {
      // 监听窗口大小变化事件
      window.addEventListener("resize", this.onWindowResize.bind(this));
    }
  }
  //动画渲染
  animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // 执行额外函数
    for (const [key, func] of this.animateFuncMap) {
      func();
    }
    // 更新渲染器
    this.composer.render();
    // this.renderer.render(this.scene, this.camera);
  };

  //添加新的通道到composer  [render,smaa,com] leng 3
  addComposerPass(name: string, pass: any, index?: number): boolean {
    const passLength = this.composer.passes.length;
    if (index && (index === 0 || index >= passLength - 1)) {
      console.warn(
        `错误的插入位置,处理通道插入位置应该在1到 ${passLength - 2}`
      );
      return false;
    }
    if (index) {
      this.composer.insertPass(pass, index);
      return true;
    }
    this.composer.insertPass(pass, passLength - 2);
    this.composerPassMap.set(name, pass);
    return true;
  }

  removeComposerPass(name: string): boolean {
    if (!this.composerPassMap.has(name)) {
      console.warn("你正在试图移除一个不存在的处理通道");
      return false;
    }
    const pass = this.composerPassMap.get(name);
    this.composer.removePass(pass);
    return true;
  }

  //在更新renderer或者相机后要手动更新renderPass重新注入新的相机
  updateComposerRenderPass() {
    // RenderPass 必须作为第一个通道，它负责将场景渲染到内部缓冲区
    const oldRendererPass = this.composer.passes[0];
    this.composer.removePass(oldRendererPass);
    const newRendererPass = new RenderPass(this.scene, this.camera);
    this.composer.insertPass(newRendererPass, 0);
  }

  //监听窗口变化
  onWindowResize() {
    const newWidth = this.container.clientWidth;
    const newHeight = this.container.clientHeight;
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = newWidth / newHeight;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(newWidth, newHeight);
    this.composer.setSize(newWidth, newHeight);
  }

  //修改场景设置
  setSceneOption(config: SceneOption) {
    const { background } = config;

    if (typeof background === "string")
      this.scene.background = new THREE.Color(background);
  }

  // 添加要循环执行的函数
  addAnimateFunc(name: string, func: () => void) {
    this.animateFuncMap.set(name, func);
  }
  // 移除指定的动画函数
  removeAnimateFunc(name: string) {
    this.animateFuncMap.delete(name);
  }

  //添加插件卸载函数
  addDisposeFunc(name: string, func: () => void) {
    this.disposeFuncMap.set(name, func);
  }
  //移除卸载函数
  removeDisposeFunc(name: string) {
    this.disposeFuncMap.delete(name);
  }

  //卸载单个Object3D
  disposeObject(model: THREE.Object3D) {
    if (!model) return;
    if (model.parent) {
      model.parent.remove(model);
    }
    model.traverse((child) => {
      // 检查是否是 CSS2DObject
      if (child instanceof CSS2DObject) {
        if (child.element && child.element.parentNode) {
          child.element.parentNode.removeChild(child.element);
        }
      }
      // 检查是否是网格（Mesh）
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              material.map?.dispose();
              material.dispose();
            });
          } else {
            child.material.map?.dispose();
            child.material.dispose();
          }
        }
      }
    });
  }

  //清空资源
  dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resize) {
      window.removeEventListener("resize", this.onWindowResize.bind(this));
    }
    if (this.renderer) {
      this.renderer.dispose(); // 释放渲染器资源
    }

    if (this.container && this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement); // 从容器中移除渲染器
    }

    //调用注册的清除函数
    for (const [key, value] of this.disposeFuncMap) {
      value();
    }
    // 释放场景中的所有对象
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            material.map?.dispose(); // 释放纹理
            material.dispose();
          });
        } else {
          object.material?.map?.dispose(); // 释放纹理
          object.material?.dispose();
        }
      }
    });

    // 清空场景
    this.scene.clear();

    //清空引用
    this.container = null as any;
    this.scene = null as any;
    this.camera = null as any;
    this.renderer = null as any;
    this.clock = null as any;
    this.animateFuncMap.clear(); // 清空动画函数对象
    this.animationFrameId = null; // 清空动画帧ID
    this.resize = false; // 清空resize状态
  }
}

export { Base };
