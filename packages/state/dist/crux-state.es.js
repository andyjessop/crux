function createQueue() {
    const entries = [];
    let flushing = false;
    return {
        add,
        flush,
    };
    function add(fn, ...params) {
        entries.push({
            fn,
            params,
        });
    }
    async function flush() {
        if (flushing) {
            return;
        }
        const entry = entries.shift();
        if (!entry) {
            flushing = false;
            return;
        }
        flushing = true;
        entry.fn(...entry.params);
        if (entries.length) {
            return flush();
        }
    }
}

function createStore(initialState) {
    const state = { ...initialState };
    const queue = createQueue();
    let paused = false;
    return {
        get,
        observe,
        pause,
        resume,
        update,
    };
    function get() {
        return state;
    }
    function observe(target, callback) {
        const revocable = Proxy.revocable(target, {
            set(targetObj, name, value) {
                targetObj[name] = value;
                queue.add(callback, name, value);
                if (!paused) {
                    queue.flush();
                }
                return true;
            },
        });
        return [revocable.proxy, () => revocable.revoke()];
    }
    function pause() {
        paused = true;
    }
    function resume() {
        paused = false;
        queue.flush();
    }
    function update(callback) {
        Object.assign(state, callback(state));
    }
}

export { createStore };
//# sourceMappingURL=crux-state.es.js.map
