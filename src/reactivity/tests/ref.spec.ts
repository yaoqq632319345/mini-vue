import { effect } from '../effect';
import { ref } from '../ref';

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
});
