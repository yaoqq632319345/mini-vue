import { createComponentInstance, setupComponent } from './component';

export function render(vnode: any, rootContainer) {
  patch(vnode, rootContainer);
}
function patch(vnode: any, rootContainer: any) {
  const { type } = vnode;
  if (typeof type === 'string') {
    // 处理真实element
    processElement(vnode, rootContainer);
  } else {
    processComponent(vnode, rootContainer);
  }
}

// 元素处理逻辑
function processElement(vnode, container) {
  mountElement(vnode, container); // 初始化逻辑
}
function mountElement(vnode, container) {
  const { type, props, children } = vnode;
  const el: HTMLElement = (vnode.el = document.createElement(type));
  for (let k in props) {
    el.setAttribute(k, props[k]);
  }
  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach((v) => {
      patch(v, el);
    });
  }

  container.append(el);
}

// 组件处理逻辑
function processComponent(vnode, container) {
  mountComponent(vnode, container); // 初始化逻辑
}
function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance); // 组件初始化完毕

  // 处理子节点
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance: any, container) {
  const subTree = instance.render.call(instance.proxy);

  // 也是调用patch
  patch(subTree, container);

  // 处理完毕子树之后，subtree.el 就会有值了
  instance.vnode.el = subTree.el;
}
