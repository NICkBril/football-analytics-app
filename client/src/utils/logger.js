// ============================================================
// START: LAB 9 — Implementing a Logging Decorator with Configurable Log Levels
// ============================================================
// 
function getTimestamp() {
  return new Date().toISOString();
}

function log(level, message, data) {
  const prefix = `[${getTimestamp()}] [${level}]`;
  if (level === "ERROR") {
    console.error(`${prefix} ${message}`, data ?? "");
  } else if (level === "DEBUG") {
    console.debug(`${prefix} ${message}`, data ?? "");
  } else {
    console.log(`${prefix} ${message}`, data ?? "");
  }
}

export function withLogging(fn, level = "INFO") {
  return async function (...args) {
    log(level, `→ Calling ${fn.name}()`, args.length ? args : "no args");
    const startTime = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      if (level !== "ERROR") {
        log(level, `✓ ${fn.name}() done in ${duration}ms`, result);
      }
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      log("ERROR", `✗ ${fn.name}() failed after ${duration}ms`, error.message);
      throw error;
    }
  };
}
// END: LAB 9