import { createRenderer } from '../runtime-core';

function createElement(type) {
  return document.createElement(type);
}

function patchProp(el, k, prevVal, nextVal) {
  const isOn = (k: string) => /^on[A-Z]/.test(k);
  if (isOn(k)) {
    // 代表事件
    const event = k.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(k);
    } else {
      el.setAttribute(k, nextVal);
    }
  }
}

function insert(el, parent, anchor = null) {
  (parent as HTMLElement).insertBefore(el, anchor);
}

function createTextNode(text) {
  return document.createTextNode(text);
}
function remove(el: HTMLElement) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el);
  }
}
function setElementText(el: HTMLElement, text: string) {
  el.textContent = text;
}
const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  createTextNode,
  setElementText,
  remove,
});

export * from '../runtime-core';
export function createApp(...arg) {
  return renderer.createApp(...arg);
}
