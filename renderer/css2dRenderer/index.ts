import type { Base } from "../../base";
import {
  CSS2DRenderer as CSS2DRendererThree,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import type { CSS2DObiectConfig } from "./types";

class CSS2DRenderer {
  base: Base;

  constructor(base: Base, config?: { pointerEvents?: string }) {
    this.base = base;
    const { pointerEvents = "auto" } = config || {}; // 默认允许指针事件,'none'为不允许
    const labelRenderer = new CSS2DRendererThree();
    labelRenderer.setSize(
      base.container.clientWidth,
      base.container.clientHeight
    );
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.pointerEvents = pointerEvents;
    document.body.appendChild(labelRenderer.domElement);

    this.base.addAnimateFunc("CSS2DRenderer", () => {
      labelRenderer.render(base.scene, base.camera);
    });
  }

  createCSS2DObject(
    element: HTMLElement,
    config: CSS2DObiectConfig
  ): CSS2DObject {
    const { place, position, name, visible = true } = config;
    const label = new CSS2DObject(element);
    label.position.set(...position);
    label.visible = visible;
    if (name) label.name = name;
    place.add(label);
    return label;
  }

  dispose() {
    this.base.removeAnimateFunc("CSS2DRenderer");
  }
}

export { CSS2DRenderer };
