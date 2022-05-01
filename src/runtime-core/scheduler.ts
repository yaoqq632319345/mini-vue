const queue: any[] = [];
let isPending = false;
const p = Promise.resolve();
export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  queFlush();
}
export function nextTick(fn) {
  return fn ? p.then(fn) : p;
}
function queFlush() {
  if (isPending) return;
  isPending = true;
  nextTick(() => {
    flushJobs();
  });
}

function flushJobs() {
  while (queue.length) {
    const job = queue.shift();
    job && job();
  }
  isPending = false;
}
