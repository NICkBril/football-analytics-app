// ============================================================
// START: LAB 1 — Generators and Iterators
// ============================================================

export function* roundRobinGenerator(items) {
  if (!items || items.length === 0) {
    return;
  }

  let index = 0;
  while (true) {
    yield items[index];
    index = (index + 1) % items.length;
  }
}

export function consumeWithTimeout(iterator, durationMs) {
  const results = [];
  const startTime = Date.now();

  for (const value of iterator) {
    results.push(value);

    if (Date.now() - startTime >= durationMs) {
      break;
    }
  }

  return results;
}
// END: LAB 1