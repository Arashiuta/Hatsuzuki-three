import type { Base } from "../../base";
import {
  CSS2DRenderer as CSS2DRendererThree,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import type { CSS2DObiectConfig } from "./types";

class CSS2DRenderer {
  base: Base;
  loadMap: Map<string, CSS2DObject>;
  renderer: CSS2DRendererThree;

  constructor(base: Base, config?: { pointerEvents?: string }) {
    this.base = base;
    this.loadMap = new Map();
    const { pointerEvents = "auto" } = config || {}; // 默认允许指针事件,'none'为不允许
    this.renderer = new CSS2DRendererThree();
    this.renderer.setSize(
      base.container.clientWidth,
      base.container.clientHeight
    );
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0px";
    this.renderer.domElement.style.pointerEvents = pointerEvents;
    document.body.appendChild(this.renderer.domElement);

    this.base.addAnimateFunc("CSS2DRenderer", () => {
      this.renderer.render(base.scene, base.camera);
    });
  }

  createCSS2DObject(
    element: HTMLElement,
    config: CSS2DObiectConfig
  ): CSS2DObject {
    const { place, position, name, visible = true } = config;
    if (!place) throw new Error("place is required");
    const label = new CSS2DObject(element);
    label.position.set(...position);
    label.visible = visible;
    if (name) label.name = name;
    place.add(label);
    this.loadMap.set(name || String(new Date().getTime()), label);
    return label;
  }

  removeCSS2DObject(name: string) {
    const label = this.loadMap.get(name);
    if (label) {
      label.parent?.remove(label);
      this.loadMap.delete(name);
    }
  }

  visible(order: boolean) {
    this.loadMap.forEach((item) => {
      item.visible = order;
    });
  }

  dispose() {
    this.loadMap.forEach((item) => {
      item.parent?.remove(item);
    });
    this.base.removeAnimateFunc("CSS2DRenderer");
  }
}

export { CSS2DRenderer };
