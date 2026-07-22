// Firebase Configuration
// IMPORTANTE: Reemplaza estos valores con tu propia configuración de Firebase
// Ve a https://console.firebase.google.com para obtenerlos

const firebaseConfig = {
    apiKey: "AIzaSyCSBO4MPils5KdLF1cpqiJkmyW7ilwzlSA",
    authDomain: "cazatec.firebaseapp.com",
    projectId: "cazatec",
    storageBucket: "cazatec.firebasestorage.app",
    messagingSenderId: "125198952289",
    appId: "1:125198952289:web:618ab17163130af2ca8720"
};

// Initialize Firebase
let db = null;
let storage = null;

function initFirebase() {
    try {
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            storage = firebase.storage();
            console.log('Firebase initialized successfully');
            return true;
        } else {
            console.warn('Firebase SDK not loaded, using localStorage fallback');
            return false;
        }
    } catch (e) {
        console.warn('Firebase initialization failed, using localStorage fallback:', e);
        return false;
    }
}

// LocalStorage fallback for offline functionality
const LocalDB = {
    get(key) {
        try {
            const data = localStorage.getItem('cazatec_' + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem('cazatec_' + key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },
    remove(key) {
        localStorage.removeItem('cazatec_' + key);
    }
};

// Generic data operations with Firebase + localStorage fallback
const DataService = {
    useFirebase: false,

    async init() {
        this.useFirebase = initFirebase();
    },

    async save(collection, id, data) {
        if (this.useFirebase && db) {
            try {
                await db.collection(collection).doc(id).set(data, { merge: true });
                return true;
            } catch (e) {
                console.error('Firebase save error:', e);
            }
        }
        // Fallback to localStorage
        const all = LocalDB.get(collection) || {};
        all[id] = data;
        LocalDB.set(collection, all);
        return true;
    },

    async get(collection, id) {
        if (this.useFirebase && db) {
            try {
                const doc = await db.collection(collection).doc(id).get();
                return doc.exists ? doc.data() : null;
            } catch (e) {
                console.error('Firebase get error:', e);
            }
        }
        const all = LocalDB.get(collection) || {};
        return all[id] || null;
    },

    async getAll(collection) {
        if (this.useFirebase && db) {
            try {
                const snapshot = await db.collection(collection).get();
                const results = {};
                snapshot.forEach(doc => {
                    results[doc.id] = doc.data();
                });
                return results;
            } catch (e) {
                console.error('Firebase getAll error:', e);
            }
        }
        return LocalDB.get(collection) || {};
    },

    async remove(collection, id) {
        if (this.useFirebase && db) {
            try {
                await db.collection(collection).doc(id).delete();
                return true;
            } catch (e) {
                console.error('Firebase remove error:', e);
            }
        }
        const all = LocalDB.get(collection) || {};
        delete all[id];
        LocalDB.set(collection, all);
        return true;
    },

    async saveImage(base64Data, path) {
        if (this.useFirebase && storage) {
            try {
                const ref = storage.ref(path);
                await ref.putString(base64Data, 'data_url');
                return await ref.getDownloadURL();
            } catch (e) {
                console.error('Firebase image save error:', e);
            }
        }
        // Fallback: store base64 in localStorage
        const imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        LocalDB.set('images_' + imageId, base64Data);
        return base64Data;
    }
};
