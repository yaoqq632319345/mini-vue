import { EMPTY_OBJ } from './../shared/index';
import { Fragment, Text } from './vnode';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';
import { effect } from '../reactivity';
import { ___console } from '../shared/console';
import { shouldUpdateComponet } from './componentUpdateUtils';

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    createTextNode: hostCreateTextNode,
    setElementText: hostSetElementText,
    remove: hostRemove,
  } = options;
  function render(vnode: any, rootContainer) {
    patch(null, vnode, rootContainer, null, null);
  }
  function patch(n1, n2: any, rootContainer: any, parentComponent, anchor) {
    const { shapeFlag, type } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, rootContainer, parentComponent, anchor);
        break;
      case Text:
        processTextVNode(n1, n2, rootContainer, anchor);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理真实element
          processElement(n1, n2, rootContainer, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, rootContainer, parentComponent, anchor);
        }
    }
  }
  function processTextVNode(n1, n2, container, anchor) {
    const { children } = n2;
    const textNode = (n2.el = hostCreateTextNode(children));
    hostInsert(textNode, container, anchor);
  }
  // 只渲染子元素
  function processFragment(n1, n2, container, parentComponent, anchor) {
    mountChildren(n2.children, container, parentComponent, anchor);
  }

  // 元素处理逻辑
  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor); // 初始化逻辑
    } else {
      patchElement(n1, n2, container, parentComponent, anchor); // 更新逻辑
    }
  }
  function patchElement(n1, n2, container, parentComponent, anchor) {
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }
  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const { shapeFlag, children: c2 } = n2;
    const { shapeFlag: prevShapeFlag, children: c1 } = n1;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 新节点是文本
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 如果之前的节点是数组，先移除
        unMountedChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      // 新节点是数组
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 如果之前的节点是文本，先清除
        hostSetElementText(container, '');
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        // =====array -> array========= 双端对比
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function patchKeyedChildren(
    c1,
    c2,
    container,
    parentComponent,
    parentAnchor
  ) {
    let i = 0,
      e1 = c1.length - 1,
      l2 = c2.length,
      e2 = l2 - 1;

    // 左侧diff
    while (i <= e1 && i <= e2) {
      const n1 = c1[i],
        n2 = c2[i];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }
    // 右侧diff
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1],
        n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    // 旧的没了
    if (i > e1) {
      // 新的还有
      if (i <= e2) {
        // e2 + 1 就是判断e2是在左边添加还是在右边添加
        const anchor = e2 + 1 < l2 ? c2[e2 + 1].el : null;
        while (i <= e2) {
          const n2 = c2[i++];
          patch(null, n2, container, parentComponent, anchor);
        }
      }
    }
    // 新的没了
    else if (i > e2) {
      // 旧的还有
      while (i <= e1) {
        const n1 = c1[i++];
        hostRemove(n1.el);
      }
    } else {
      // 新旧都还有
      ___console(
        `======array -> array===== diff ===========`,
        '\n' +
          `【 i 】表示不同元素的起点:${i}--【e1】表示老数组的终点:${e1}--【e2】表示新数组的终点:${e2}`
      );

      let s1 = i, // c1起点
        s2 = i; // c2起点
      const toBePatched = e2 - s1 + 1; // 待处理的新数组个数
      const keyToNewIndexMap = new Map();
      const newIndexToOldIndexMap = new Array(toBePatched).fill(-1);
      for (let j = s2; j <= e2; j++) {
        keyToNewIndexMap.set(c2[j].key, j);
      }
      for (let j = s1; j <= e1; j++) {
        const n1 = c1[j];
        if (keyToNewIndexMap.size === 0) {
          hostRemove(n1.el);
          continue;
        }
        const oldKey = n1.key;
        const newIndex = keyToNewIndexMap.get(oldKey);

        let n2;
        if (newIndex && isSameVNodeType(n1, (n2 = c2[newIndex]))) {
          keyToNewIndexMap.delete(oldKey);
          newIndexToOldIndexMap[newIndex - s2] = j;
          patch(n1, n2, container, parentComponent, parentAnchor);
        } else {
          hostRemove(n1.el);
        }
      }
      console.log(newIndexToOldIndexMap);
      const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap);
      console.log(increasingNewIndexSequence);
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + s2; // 实际坐标
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 > c2.length ? null : c2[nextIndex + 1].el;
        if (newIndexToOldIndexMap[i] === -1) {
          // 新节点
          patch(null, nextChild, container, parentComponent, anchor);
        } else if (increasingNewIndexSequence.includes(i)) {
          // 不需要移动
          console.log('不需要移动');
        } else {
          console.log('移动');
          hostInsert(nextChild.el, container, anchor);
        }
      }
    }
  }
  function unMountedChildren(children) {
    for (let i = 0; i < children.length; i++) {
      hostRemove(children[i].el);
    }
  }
  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) return;
    for (let k in newProps) {
      const nextVal = newProps[k];
      const prevVal = oldProps[k];
      if (nextVal !== prevVal) {
        hostPatchProp(el, k, prevVal, nextVal);
      }
    }
    for (let k in oldProps) {
      if (!(k in newProps)) {
        hostPatchProp(el, k, oldProps[k], null);
      }
    }
  }
  function mountElement(vnode, container, parentComponent, anchor) {
    const { type, props, children, shapeFlag } = vnode;
    const el: HTMLElement = (vnode.el = hostCreateElement(type));
    for (let k in props) {
      const val = props[k];
      hostPatchProp(el, k, null, val);
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent, anchor);
    }

    hostInsert(el, container, anchor);
  }
  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }

  // 组件处理逻辑
  function processComponent(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountComponent(n2, container, parentComponent, anchor); // 初始化逻辑
    } else {
      updateComponent(n1, n2);
    }
  }
  function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component);
    if (shouldUpdateComponet(n1, n2)) {
      instance.next = n2;
      instance.update();
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  }
  function mountComponent(
    initialVNode: any,
    container,
    parentComponent,
    anchor
  ) {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent
    ));
    setupComponent(instance); // 组件初始化完毕

    // 处理子节点
    setupRenderEffect(instance, initialVNode, container, anchor);
  }
  function setupRenderEffect(instance: any, initialVNode, container, anchor) {
    instance.update = effect(() => {
      if (!instance.isMounted) {
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        // console.log('初始化subTree:', subTree);

        // 也是调用patch
        patch(null, subTree, container, instance, anchor);
        // 处理完毕子树之后，subtree.el 就会有值了
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const { next, vnode } = instance;
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next);
        }
        const preSubTree = instance.subTree;
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        // console.log('更新subTree:', subTree);
        patch(preSubTree, subTree, container, instance, anchor);
      }
      // console.log(`组件vnode:`, initialVNode);
    });
  }
  function updateComponentPreRender(instance, nextVNode) {
    instance.vnode = nextVNode;
    instance.next = null;
    instance.props = nextVNode.props;
  }
  return {
    createApp: createAppAPI(render),
  };
}

// 最长递增子序列
function getSequence(nums) {
  let len = nums.length;
  let arr = [0];

  let pre: any[] = [];

  for (let i = 1; i < len; i++) {
    const ln = arr.length;
    if (nums[i] > nums[arr[ln - 1]]) {
      pre[i] = arr[ln - 1];
      arr.push(i);
      continue;
    }

    let l = 0,
      r = ln - 1;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (nums[arr[mid]] >= nums[i]) {
        r = mid;
      } else {
        l = mid + 1;
      }
    }
    pre[i] = arr[l - 1];
    arr[l] = i;
  }

  let a = arr.length,
    prev = arr[a - 1];
  while (a--) {
    arr[a] = prev;
    prev = pre[prev];
  }

  return arr;
}
