const LocalDB = {
    get(key) {
        try {
            const data = localStorage.getItem('cazatec_' + key);
            return data ? JSON.parse(data) : null;
        } catch (e) { return null; }
    },
    set(key, value) {
        try {
            localStorage.setItem('cazatec_' + key, JSON.stringify(value));
            return true;
        } catch (e) { return false; }
    },
    remove(key) {
        localStorage.removeItem('cazatec_' + key);
    },
    exportAll() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('cazatec_')) {
                data[key] = localStorage.getItem(key);
            }
        }
        return JSON.stringify(data);
    },
    importAll(jsonStr) {
        const data = JSON.parse(jsonStr);
        Object.keys(data).forEach(key => {
            if (key.startsWith('cazatec_')) {
                localStorage.setItem(key, data[key]);
            }
        });
    }
};

const DataService = {
    async init() {},

    async save(collection, id, data) {
        const all = LocalDB.get(collection) || {};
        all[id] = data;
        LocalDB.set(collection, all);
        return true;
    },

    async get(collection, id) {
        const all = LocalDB.get(collection) || {};
        return all[id] || null;
    },

    async getAll(collection) {
        return LocalDB.get(collection) || {};
    },

    async remove(collection, id) {
        const all = LocalDB.get(collection) || {};
        delete all[id];
        LocalDB.set(collection, all);
        return true;
    },

    async saveImage(base64Data, path) {
        return base64Data;
    }
};
