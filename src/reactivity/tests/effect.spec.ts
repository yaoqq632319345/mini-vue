import { effect, stop } from '../effect';
import { reactive } from '../reactive';

describe('effect 副作用模块', () => {
  it('核心模块', () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);

    user.age++;

    expect(nextAge).toBe(12);
  });
  it('effect 返回 runner 调度器', () => {
    const foo = { foo: 10 };
    const runner = effect(() => {
      foo.foo++;
      return 'foo';
    });
    expect(foo.foo).toBe(11);
    const res = runner();
    expect(foo.foo).toBe(12);
    expect(res).toBe('foo');
  });
  it('scheduler 当set的时候由外部调度控制', () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });

  it('stop 方法', () => {
    let dummy;
    const obj = reactive({ foo: 1 });
    const runner = effect(() => (dummy = obj.foo));
    obj.foo = 2;
    expect(dummy).toBe(2);
    // 停止后不再更新
    stop(runner);
    obj.foo++; //重新触发依赖收集，会有问题
    expect(dummy).toBe(2);

    // 手动触发
    runner();
    expect(dummy).toBe(3);
  });

  it('onStop 回调函数', () => {
    const obj = reactive({ foo: 1 });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop }
    );
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
