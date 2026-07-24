// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSBO4MPils5KdLF1cpqiJkmyW7ilwzlSA",
    authDomain: "cazatec.firebaseapp.com",
    projectId: "cazatec",
    storageBucket: "cazatec.firebasestorage.app",
    messagingSenderId: "125198952289",
    appId: "1:125198952289:web:618ab17163130af2ca8720"
};

let db = null;
let storage = null;

function initFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded');
            return false;
        }
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        storage = firebase.storage();
        db.collection('_test').doc('_test').get().catch(() => {});
        return true;
    } catch (e) {
        console.warn('Firebase init failed:', e);
        return false;
    }
}

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
    }
};

function firebaseOp(fn, fallback) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.warn('Firebase timeout, using localStorage');
            resolve(fallback());
        }, 5000);
        fn().then(result => {
            clearTimeout(timeout);
            resolve(result);
        }).catch(e => {
            clearTimeout(timeout);
            console.error('Firebase error:', e);
            resolve(fallback());
        });
    });
}

const DataService = {
    useFirebase: false,

    async init() {
        this.useFirebase = initFirebase();
    },

    async save(collection, id, data) {
        if (this.useFirebase && db) {
            const result = await firebaseOp(
                () => db.collection(collection).doc(id).set(data, { merge: true }),
                () => null
            );
            if (result !== null) return true;
        }
        const all = LocalDB.get(collection) || {};
        all[id] = data;
        LocalDB.set(collection, all);
        return true;
    },

    async get(collection, id) {
        if (this.useFirebase && db) {
            const result = await firebaseOp(
                () => db.collection(collection).doc(id).get().then(doc => doc.exists ? doc.data() : null),
                () => undefined
            );
            if (result !== undefined) return result;
        }
        const all = LocalDB.get(collection) || {};
        return all[id] || null;
    },

    async getAll(collection) {
        if (this.useFirebase && db) {
            const result = await firebaseOp(
                () => db.collection(collection).get().then(snapshot => {
                    const results = {};
                    snapshot.forEach(doc => { results[doc.id] = doc.data(); });
                    return results;
                }),
                () => undefined
            );
            if (result !== undefined) return result;
        }
        return LocalDB.get(collection) || {};
    },

    async remove(collection, id) {
        if (this.useFirebase && db) {
            await firebaseOp(
                () => db.collection(collection).doc(id).delete(),
                () => null
            );
        }
        const all = LocalDB.get(collection) || {};
        delete all[id];
        LocalDB.set(collection, all);
        return true;
    },

    async saveImage(base64Data, path) {
        if (this.useFirebase && storage) {
            const result = await firebaseOp(
                () => {
                    const ref = storage.ref(path);
                    return ref.putString(base64Data, 'data_url').then(() => ref.getDownloadURL());
                },
                () => null
            );
            if (result) return result;
        }
        const imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        LocalDB.set('images_' + imageId, base64Data);
        return base64Data;
    }
};
