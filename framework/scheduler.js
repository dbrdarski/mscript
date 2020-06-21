export const scheduler = (scheduleOnParent) => {
  let scheduled = false;
  const queue = [];
  const run = () => {
    queue.forEach(task => {
      task();
    });
    queue.length = 0;
    scheduled = false;
  };

  return function schedule (task) {
    scheduled || scheduleOnParent(run);
    queue.push(task);
  };
};
