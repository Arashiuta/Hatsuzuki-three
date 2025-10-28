import type { Base } from "../../base";
import {
  CSS3DRenderer as CSS3DRendererThree,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js"; // 注意：导入路径需要根据实际情况调整
import type { CSS3DObjectConfig } from "./types"; // 复用你的配置接口

class CSS3DRenderer {
  base: Base;
  loadMap: Map<string, CSS3DObject>;
  renderer: CSS3DRendererThree;

  constructor(base: Base, config?: { pointerEvents?: string }) {
    this.base = base;
    this.loadMap = new Map();
    const { pointerEvents = "none" } = config || {};

    this.renderer = new CSS3DRendererThree();

    // 设置渲染器尺寸
    this.renderer.setSize(
      base.container.clientWidth,
      base.container.clientHeight
    );

    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0px";
    this.renderer.domElement.style.pointerEvents = pointerEvents;

    this.base.container.appendChild(this.renderer.domElement);

    this.base.addAnimateFunc("CSS3DRenderer", () => {
      this.renderer.render(base.scene, base.camera);
    });
  }

  createCSS3DObject(
    element: HTMLElement,
    config: CSS3DObjectConfig // 复用你现有的配置接口
  ): CSS3DObject {
    const { place, position, name, visible = true } = config;
    if (!place) throw new Error("place is required");
    const label = new CSS3DObject(element);
    label.position.set(...position);
    label.visible = visible;
    if (name) label.name = name;
    place.add(label);
    this.loadMap.set(name || String(new Date().getTime()), label);
    return label;
  }

  removeCSS3DObject(name: string): void {
    const label = this.loadMap.get(name);
    if (label) {
      label.parent?.remove(label);
      this.loadMap.delete(name);
    }
  }

  visible(order: boolean): void {
    this.loadMap.forEach((item) => {
      item.visible = order;
    });
  }

  dispose(): void {
    this.loadMap.forEach((item) => {
      item.parent?.remove(item);
    });
    this.base.removeAnimateFunc("CSS3DRenderer");
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

export { CSS3DRenderer };
