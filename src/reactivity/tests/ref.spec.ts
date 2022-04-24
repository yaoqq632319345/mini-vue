import { effect } from '../effect';
import { ref, isRef, unRef } from '../ref';

describe('Ref', () => {
  it('ref', () => {
    const count = ref(1);
    expect(count.value).toBe(1);
    count.value++;
    expect(count.value).toBe(2);
  });
  it('ref 响应式', () => {
    const count = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = count.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);

    count.value++;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);

    count.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it('对象ref', () => {
    const obj = ref({ foo: 1 });
    let dummy;
    effect(() => {
      dummy = obj.value.foo;
    });
    expect(dummy).toBe(1);
    obj.value.foo++;
    expect(dummy).toBe(2);
    obj.value = {
      foo: 100,
    };
    expect(dummy).toBe(100);
    obj.value.foo++;
    expect(dummy).toBe(101);
  });

  it('isRef', () => {
    const a = ref(1);
    const b = { a: 1 };
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(b)).toBe(false);
  });

  it('unRef', () => {
    const a = ref(1);
    const b = { a: 1 };
    const c = ref(b);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
    expect(unRef(b)).toStrictEqual(b);
    expect(unRef(c)).toStrictEqual(b);
  });
});
