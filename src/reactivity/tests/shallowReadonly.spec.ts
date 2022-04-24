import { isReadonly, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  it('判断是否shallowReadonly', () => {
    const ori = { foo: { bar: 1 } };
    const obj = shallowReadonly(ori);
    expect(isReadonly(obj)).toBe(true);
    expect(isReadonly(obj.foo)).toBe(false);
  });
  it('shallowReadonly set 警告', () => {
    console.warn = jest.fn();
    const user = shallowReadonly({
      age: 18,
    });
    user.age++;

    expect(console.warn).toBeCalled();
  });
});
