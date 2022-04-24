import { computed } from '../computed';
import { reactive } from '../reactive';

describe('computed', () => {
  it('核心逻辑', () => {
    const obj = reactive({
      foo: 100,
    });

    const c = computed(() => obj.foo);

    expect(c.value).toBe(100);
  });

  it('不调用value 不执行', () => {
    const obj = reactive({
      foo: 100,
    });
    const getter = jest.fn(() => obj.foo);
    const c = computed(getter);
    // 不调用不执行
    expect(getter).not.toHaveBeenCalled();

    expect(c.value).toBe(100);
    // 触发get，调用1次
    expect(getter).toHaveBeenCalledTimes(1);

    c.value;
    // 再次触发，因为有缓存，还是调用1次
    expect(getter).toHaveBeenCalledTimes(1);

    obj.foo *= 10;
    // 更新依赖值，但是没有触发get，还是1次
    expect(getter).toHaveBeenCalledTimes(1);

    expect(c.value).toBe(1000);
    // 触发get, 2次调用
    expect(getter).toHaveBeenCalledTimes(2);

    c.value;
    // 再次触发，因为有缓存，还是调用2次
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
