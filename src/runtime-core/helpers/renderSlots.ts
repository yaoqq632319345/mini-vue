import { createVNode } from '../vnode';

// export function renderSlots(slots, name, props) {
//   const slot = slots[name];
//   console.log(slot);

//   let res;
//   if (slot && typeof slot === 'function') {
//     res = slot(props);
//   }
//   res = Array.isArray(res) ? res : [res]
//   if (Array.isArray(res)) {
//     return createVNode('div', {}, res);
//   } else if (res) {
//     return createVNode('div', {}, res);
//   }
// }
export function renderSlots(slots, name, props) {
  const slot = slots[name];

  if (slot && typeof slot === 'function') {
    return createVNode('div', {}, slot(props));
  }
}
