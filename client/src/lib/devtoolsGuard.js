/**
 * DevTools & Source Code Protection Guard
 * Protects source code, prevents inspection via F12 / Context Menu / DevTools shortcuts,
 * and clears console outputs to prevent network/source scanning.
 */
export function initDevToolsGuard() {
  if (typeof window === 'undefined') return;

  // 1. Disable Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Block Inspect & View Source Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // F12 Key
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Inspector)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      return false;
    }

    // Cmd+Alt+I / J / C (Mac OS)
    if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      return false;
    }

    // Ctrl+U / Cmd+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page As)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      return false;
    }
  });

  // 3. Neutralize Console Methods to Prevent Inspection of Logged Objects
  const dummyFn = () => {};
  const noopConsole = {
    log: dummyFn,
    warn: dummyFn,
    info: dummyFn,
    debug: dummyFn,
    dir: dummyFn,
    table: dummyFn,
    trace: dummyFn,
    clear: dummyFn,
  };

  if (import.meta.env.PROD) {
    window.console = { ...window.console, ...noopConsole };
  }

  // 4. DevTools Open Detection Loop (Clears console & prevents scanning)
  setInterval(() => {
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;

    if (widthDiff || heightDiff) {
      try {
        console.clear();
      } catch (err) {}
    }
  }, 1000);
}
