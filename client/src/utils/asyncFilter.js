// ============================================================
// START: LAB 5 — Async Array Function Variants
// ============================================================

// --- Callback-based ---
export function filterWithCallback(array, asyncPredicate, callback) {
  if (!array || array.length === 0) {
    callback(null, []);
    return;
  }

  const results = [];
  let completed = 0;

  array.forEach((item, index) => {
    asyncPredicate(item)
      .then((passes) => {
        if (passes) results.push({ item, index });
        completed++;

        if (completed === array.length) {
          const sorted = results
            .sort((a, b) => a.index - b.index)
            .map((r) => r.item);
          callback(null, sorted);
        }
      })
      .catch((err) => callback(err, null));
  });
}

// --- Promise-based ---
export function filterWithPromise(array, asyncPredicate) {
  if (!array || array.length === 0) return Promise.resolve([]);

  const checks = array.map((item) =>
    asyncPredicate(item).then((passes) => ({ item, passes }))
  );

  return Promise.all(checks).then((results) =>
    results.filter((r) => r.passes).map((r) => r.item)
  );
}

// --- через AbortController ---
export function filterWithAbort(array, asyncPredicate, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Фільтрацію скасовано користувачем", "AbortError"));
      return;
    }

    signal?.addEventListener("abort", () => {
      reject(new DOMException("Фільтрацію скасовано користувачем", "AbortError"));
    });

    if (!array || array.length === 0) {
      resolve([]);
      return;
    }

    const checks = array.map((item) =>
      asyncPredicate(item).then((passes) => ({ item, passes }))
    );

    Promise.all(checks)
      .then((results) => {
        if (signal?.aborted) return;
        resolve(results.filter((r) => r.passes).map((r) => r.item));
      })
      .catch(reject);
  });
}
// END: LAB 5