import { ShapeFlags } from '../shared/ShapeFlags';

// export function initSlots(instance, children) {
//   const { vnode } = instance;
//   if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
//     instance.slots = children;
//   }
// }
export function initSlots(instance, children) {
  console.log(children);

  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}
function normalizeObjectSlots(children: any, slots: any) {
  for (let k in children) {
    const val = children[k];
    slots[k] = (props) => normalizeSlotValue(val(props));
  }
}

function normalizeSlotValue(value: any) {
  return Array.isArray(value) ? value : [value];
}
