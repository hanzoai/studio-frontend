// vite.config.mts runs in Node, where `localStorage` isn't a global. Loading
// vite-plugin-vue-devtools pulls in @vue/devtools-kit, which calls
// `localStorage.getItem` at module init time with no guard for that — so the
// config crashes on import unless something defines it first. This runs as
// the first side-effect import in vite.config.mts, before that chain loads.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>()

  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value))
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    }
  } as Storage
}
