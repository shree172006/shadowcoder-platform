/**
 * DevTools & Source Code Protection Guard
 * Anti-AI Copy-Paste Protection, Anti-Screenshot Guard, and DevTools Shield.
 */
export function initDevToolsGuard() {
  if (typeof window === 'undefined') return;

  // 1. Disable Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Block Anti-AI Copy, Cut, and Paste Events across workspace
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    if (e.clipboardData) e.clipboardData.setData('text/plain', '[Copy Protection Active: External code copy is disabled on ShadowCoder]');
    return false;
  });

  document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
  });

  document.addEventListener('paste', (e) => {
    e.preventDefault();
    return false;
  });

  // 3. Block Inspect, PrintScreen & View Source Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // F12 Key
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // PrintScreen / Screenshot shortcuts
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      e.preventDefault();
      if (navigator.clipboard) navigator.clipboard.writeText('');
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

    // Ctrl+S / Cmd+S (Save Page As) & Ctrl+P (Print Screen)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's' || e.key === 'P' || e.key === 'p')) {
      e.preventDefault();
      return false;
    }
  });

  // 4. Neutralize Console Methods to Prevent Inspection of Logged Objects
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

  // 5. DevTools Open Detection Loop (Clears console & prevents scanning)
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
