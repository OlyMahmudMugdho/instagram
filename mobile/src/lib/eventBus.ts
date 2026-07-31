type Listener = (payload: any) => void;

const listeners: Record<string, Listener[]> = {};

export const on = (event: string, cb: Listener) => {
  listeners[event] = listeners[event] || [];
  listeners[event].push(cb);
  return () => {
    listeners[event] = listeners[event].filter((fn) => fn !== cb);
  };
};

export const emit = (event: string, payload?: any) => {
  (listeners[event] || []).forEach((fn) => {
    try { fn(payload); } catch (e) { console.error('eventBus handler error', e); }
  });
};

export default { on, emit };