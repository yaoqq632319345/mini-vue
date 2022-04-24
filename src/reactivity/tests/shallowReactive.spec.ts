import { effect } from '../effect';
import { isReactive, shallowReactive } from '../reactive';

describe('shallowReactive', () => {
  it('判断是否shallowReactive', () => {
    const ori = { foo: { bar: 1 } };
    const obj = shallowReactive(ori);
    expect(isReactive(obj)).toBe(true);
    expect(isReactive(obj.foo)).toBe(false);
    let dummy;
    const runner = effect(() => {
      dummy = obj.foo.bar;
    });
    expect(dummy).toBe(1);
    obj.foo.bar++;
    expect(dummy).toBe(1);
    obj.foo = {
      bar: 3,
    };
    expect(dummy).toBe(3);
  });
});
