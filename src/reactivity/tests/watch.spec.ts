import { ref } from '../ref';
import { watch } from '../watch';

describe('watch', () => {
  it('核心逻辑', () => {
    const obj = ref(0);
    const fn = jest.fn();
    watch(() => obj.value, fn);
    obj.value;
    expect(fn).toBeCalledTimes(1);
  });
});
