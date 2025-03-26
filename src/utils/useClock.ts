function useClock() {
  const startTime = performance.now();
  let lastInterval = startTime;

  return {
    /**
     * Return time passed from clock start
     */
    get total() {
      const now = performance.now();
      return startTime - now;
    },

    /**
     * Return time interval from last delta() call
     */
    get interval() {
      const now = performance.now();
      return now - lastInterval;
    },

    /**
     * Return delta interval and set clock breakpoint
     */
    delta() {
      const now = performance.now();
      const delta = now - lastInterval;

      lastInterval = now;

      return delta;
    },
  };
}

export default useClock;
