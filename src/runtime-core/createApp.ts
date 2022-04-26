import { createVNode } from './vnode';

export function createAppAPI(render) {
  return (rootComponent) => {
    return {
      mount(rootContainer) {
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer);
      },
    };
  };
}
