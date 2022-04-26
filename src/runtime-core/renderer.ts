import { Fragment, Text } from './vnode';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    createTextNode: hostCreateTextNode,
  } = options;
  function render(vnode: any, rootContainer) {
    patch(vnode, rootContainer, null);
  }
  function patch(vnode: any, rootContainer: any, parentComponent) {
    const { shapeFlag, type } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode, rootContainer, parentComponent);
        break;
      case Text:
        processTextVNode(vnode, rootContainer);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理真实element
          processElement(vnode, rootContainer, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, rootContainer, parentComponent);
        }
    }
  }
  function processTextVNode(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = hostCreateTextNode(children));
    hostInsert(textNode, container);
  }
  // 只渲染子元素
  function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode.children, container, parentComponent);
  }

  // 元素处理逻辑
  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent); // 初始化逻辑
  }
  function mountElement(vnode, container, parentComponent) {
    const { type, props, children, shapeFlag } = vnode;
    const el: HTMLElement = (vnode.el = hostCreateElement(type));
    for (let k in props) {
      const val = props[k];
      hostPatchProp(el, k, val);
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent);
    }

    hostInsert(el, container);
  }
  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      patch(v, container, parentComponent);
    });
  }

  // 组件处理逻辑
  function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent); // 初始化逻辑
  }
  function mountComponent(vnode: any, container, parentComponent) {
    const instance = createComponentInstance(vnode, parentComponent);
    setupComponent(instance); // 组件初始化完毕

    // 处理子节点
    setupRenderEffect(instance, container);
  }
  function setupRenderEffect(instance: any, container) {
    const subTree = instance.render.call(instance.proxy);

    // 也是调用patch
    patch(subTree, container, instance);

    // 处理完毕子树之后，subtree.el 就会有值了
    instance.vnode.el = subTree.el;
  }

  return {
    createApp: createAppAPI(render),
  };
}
