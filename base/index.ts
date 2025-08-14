import * as THREE from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { BaseConfig, SceneOption } from "./types";

class Base {
  container: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  controller: OrbitControls | null; // 控制器
  autoShadow: boolean; //自动阴影
  resize: boolean; // 是否自动调整大小
  animateFuncObj: Map<string, () => void> = new Map(); // 存储动画运行函数的对象
  animationFrameId: number | null; // 用于存储requestAnimationFrame的ID

  constructor(config?: BaseConfig) {
    const {
      container = "#Space",
      autoShadow = false,
      resize = true,
    } = config || {};
    this.container =
      container instanceof HTMLElement
        ? container
        : (document.querySelector(container) as HTMLElement);
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.resize = resize;
    this.controller = null; // 初始化控制器为null
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
      antialias: true, // 启用抗锯齿
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
    for (const [key, func] of this.animateFuncObj) {
      func();
    }
    // 更新渲染器
    this.renderer.render(this.scene, this.camera);
  };
  //监听窗口变化
  onWindowResize() {
    const newWidth = this.container.clientWidth;
    const newHeight = this.container.clientHeight;
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = newWidth / newHeight;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(newWidth, newHeight);
  }

  addToScene(object: THREE.Object3D, name?: string) {
    if (name) {
      object.name = name; // 设置对象名称
    }
    this.scene.add(object);
  }

  setSceneOption(config: SceneOption) {
    const { background } = config;

    if (typeof background === "string")
      this.scene.background = new THREE.Color(background);
  }

  // 添加要循环执行的函数
  addAnimateFunc(name: string, func: () => void) {
    this.animateFuncObj.set(name, func);
  }
  // 移除指定的动画函数
  removeAnimateFunc(name: string) {
    this.animateFuncObj.delete(name);
  }

  disposeObject(model: THREE.Object3D) {
    if (!model) return;
    if (model.parent) {
      model.parent.remove(model);
    }
    model.traverse((child) => {
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
    if (this.controller) {
      this.controller.dispose(); // 释放控制器资源
    }
    if (this.container && this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement); // 从容器中移除渲染器
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
    this.controller = null; // 清空控制器引用
    this.animateFuncObj.clear(); // 清空动画函数对象
    this.animationFrameId = null; // 清空动画帧ID
    this.resize = false; // 清空resize状态
  }
}

export { Base };
