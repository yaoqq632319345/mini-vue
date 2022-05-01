import {
  h,
  ref,
  nextTick,
  getCurrentInstance,
} from '../../lib/guide-mini-vue.esm.js';

export const App = {
  name: 'App',
  setup() {
    const count = ref(1);
    const _this = getCurrentInstance();
    const changeCount = () => {
      for (let i = 0; i < 100; i++) {
        count.value++;
      }
      console.log(_this);

      nextTick(() => {
        console.log(_this);
      });
    };

    return { changeCount, count };
  },

  render() {
    return h('div', {}, [
      h(
        'button',
        {
          onClick: this.changeCount,
        },
        '更新'
      ),
      h('p', {}, 'count: ' + this.count),
    ]);
  },
};
