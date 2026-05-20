// ============================================================
// START: LAB 6 — Large Data Processing with Async Iterators
// ============================================================

export async function* matchStreamGenerator(matches, chunkSize = 15) {
  for (let i = 0; i < matches.length; i += chunkSize) {
    const chunk = matches.slice(i, i + chunkSize);

    await new Promise((resolve) => {
      return setTimeout(resolve, 50);
    });
    
    yield chunk;
  }
}
// END: LAB 6