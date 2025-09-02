![1c0f5b278982d8c14aa41638fc354f6](https://github.com/user-attachments/assets/17d6fed0-07c6-46a5-8a70-d821b8b96115)
<div align="center">
  <h1>Hatsuzuki-three</h1>
  <span>封装了一些threejs方法的工具</span>
</div>

---

# 基础使用
将本项目放到你的项目目录下，如`src/tools/hatsizuki-three/index`
确保安装`three`和`mitt`两个包
```
npm i three
npm i mitt
```
## 示例
完整代码
```
<template>
  <div id="Space" class="space-container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as Hatsuzuki from './tools/hatsizuki-three/index'

class Space extends Hatsuzuki.Base {
  init() {
    new Hatsuzuki.Sky(this)
    new Hatsuzuki.OrbitControls(this)
    const Box = new Hatsuzuki.Box(this, { body: [20, 20, 20] })

    this.addAnimateFunc('box-rotate', () => {
      const box = Box.getModel()
      if (box) {
        box.rotation.y += 0.01
      }
    })
  }
}

onMounted(() => {
  const space = new Space();
  space.init();
})

</script>

<style scoped>
.space-container {
  width: 100vw;
  height: 100vh;
}
</style>

```
效果
![PixPin_2025-08-27_16-08-42](https://github.com/user-attachments/assets/63acb1b5-31b0-45b5-b823-39e944b03261)
