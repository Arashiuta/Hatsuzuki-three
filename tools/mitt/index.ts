import mitt from "mitt";

class Mitt {
  emitter: ReturnType<typeof mitt>;
  constructor() {
    this.emitter = mitt();
  }

  on(type: string, handler: (event: any) => void) {
    this.emitter.on(type, handler);
  }

  off(type: string, handler: (event: any) => void) {
    this.emitter.off(type, handler);
  }

  emit(type: string, event: any) {
    this.emitter.emit(type, event);
  }

  clear() {
    this.emitter.all.clear();
  }
}

export { Mitt };
