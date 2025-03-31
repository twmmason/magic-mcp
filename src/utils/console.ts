// Override console for Cursor's error handling

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

function ensureSerializable(arg: any) {
  if (arg === undefined) return "undefined";
  if (arg === null) return null;

  if (typeof arg === "object") {
    try {
      JSON.stringify(arg);
      return arg;
    } catch (e) {
      return String(arg);
    }
  }

  return arg;
}

export function setupJsonConsole() {
  console.log = function (...args) {
    const serializedArgs = args.map(ensureSerializable);
    originalConsoleLog(JSON.stringify(serializedArgs));
  };

  console.error = function (...args) {
    const serializedArgs = args.map(ensureSerializable);
    originalConsoleError(JSON.stringify(serializedArgs));
  };
}
