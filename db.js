// ============================================
// Cazatec - Capa de datos (localStorage + Supabase)
// ============================================

// ============================================
// CONFIGURACIÓN SUPABASE
// 1) Crea un proyecto gratuito en https://supabase.com
// 2) SQL Editor: ejecuta el SQL de "sync_data" (abajo en AGENTS.md o README)
// 3) Settings > API: copia la URL y la anon key y pégalas aquí.
// ============================================
const SUPABASE_URL = 'https://swkmxrmaiocofxetbvoh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Vc1ebNkqbUq8-AJ55oWkLg_ZS0ult4V';

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
            onLocalDataChange(key);
            return true;
        } catch (e) { return false; }
    },
    setSilent(key, value) {
        try {
            localStorage.setItem('cazatec_' + key, JSON.stringify(value));
            return true;
        } catch (e) { return false; }
    },
    remove(key) {
        localStorage.removeItem('cazatec_' + key);
        onLocalDataChange(key);
    },
    rawExport() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('cazatec_')) {
                data[key] = localStorage.getItem(key);
            }
        }
        return data;
    },
    exportAll() {
        return JSON.stringify(this.rawExport());
    },
    exportForSync() {
        const data = this.rawExport();
        delete data['cazatec_syncmeta'];
        delete data['cazatec_sync'];
        return data;
    },
    importAll(jsonStr) {
        const data = JSON.parse(jsonStr);
        const importedKeys = Object.keys(data).filter(key => key.startsWith('cazatec_'));
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('cazatec_') && !importedKeys.includes(key)) {
                localStorage.removeItem(key);
            }
        }
        importedKeys.forEach(key => {
            localStorage.setItem(key, data[key]);
        });
        onLocalDataChange('import');
    }
};

let __onLocalChange = null;
function onLocalDataChange(key) {
    if (__onLocalChange) {
        try { __onLocalChange(key); } catch (e) { /* noop */ }
    }
}

const DataService = {
    async init() {
        SyncService.init();
    },

    async save(collection, id, data) {
        const all = LocalDB.get(collection) || {};
        all[id] = data;
        if (!LocalDB.set(collection, all)) {
            throw new Error('Almacenamiento lleno. Elimina fotos o documentos antiguos para liberar espacio.');
        }
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

// ============================================
// SINCRONIZACIÓN (Supabase)
// Cada dispositivo guarda en localStorage (funciona offline) y además
// sincroniza con una fila de la tabla "sync_data" de Supabase.
// La clave de esa fila es un "código de sincronización" compartido entre
// tus dispositivos. Los cambios se envían automáticamente y también se
// recogen los cambios hechos en otros dispositivos.
// ============================================
const SyncService = {
    _client: null,
    _meta: null,
    _timer: null,
    _syncing: false,
    _interval: null,

    init() {
        this._registerHook();
        if (!this.configure()) return;
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') this.syncNow();
            });
            window.addEventListener('focus', () => this.syncNow());
        }
        window.addEventListener('online', () => {
            if (this._loadMeta().pending) this.syncNow();
        });
        if (this.isConnected()) {
            this._startAutoSync();
            this.syncNow();
        }
    },

    configure() {
        if (this._client) return true;
        if (typeof window === 'undefined' || !window.supabase) return false;
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY ||
            SUPABASE_URL.indexOf('TU-') === 0 || SUPABASE_ANON_KEY.indexOf('TU_') === 0) {
            return false;
        }
        try {
            this._client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return true;
        } catch (e) {
            return false;
        }
    },

    isConfigured() { return !!this._client; },
    isConnected() { return !!this._client && !!this.getCode(); },
    getCode() { return String(this._loadMeta().code || '').trim().toUpperCase(); },

    _loadMeta() {
        if (this._meta) return this._meta;
        this._meta = LocalDB.get('syncmeta') || {};
        return this._meta;
    },
    _saveMeta() {
        LocalDB.setSilent('syncmeta', this._meta);
    },

    _registerHook() {
        __onLocalChange = (key) => this._onLocalChange(key);
    },
    _onLocalChange(key) {
        if (!this.isConfigured() || !this.isConnected()) return;
        if (key === 'syncmeta' || key === 'sync') return;
        const meta = this._loadMeta();
        meta.pending = true;
        meta.lastLocalChangeAt = new Date().toISOString();
        this._saveMeta();
        this._schedulePush();
    },
    _schedulePush() {
        if (this._timer) clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this._timer = null;
            this.syncNow();
        }, 1500);
    },
    _startAutoSync() {
        if (this._interval) return;
        this._interval = setInterval(() => this.syncNow(), 60000);
    },
    _stopAutoSync() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    },

    createCode() {
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 12; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        const meta = this._loadMeta();
        meta.code = code;
        meta.pending = true;
        this._saveMeta();
        return code;
    },

    async connect(code) {
        if (!this.configure()) return false;
        const meta = this._loadMeta();
        meta.code = String(code || '').trim().toUpperCase();
        meta.pending = true;
        this._saveMeta();
        this._startAutoSync();
        return await this.syncNow();
    },

    disconnect() {
        const meta = this._loadMeta();
        delete meta.code;
        meta.pending = false;
        this._saveMeta();
        this._stopAutoSync();
    },

    async syncNow() {
        if (!this.isConfigured() || !this.isConnected()) return false;
        if (this._syncing) return false;
        this._syncing = true;
        let ok = false;
        let pulled = false;
        try {
            const meta = this._loadMeta();
            let res;
            if (meta.pending) {
                res = await this._push();
            } else {
                res = await this._pull();
            }
            ok = !!res.ok;
            pulled = !!res.applied;
        } catch (e) {
            ok = false;
        } finally {
            this._syncing = false;
            try {
                window.dispatchEvent(new CustomEvent('cazatec-sync', { detail: { ok, pulled } }));
            } catch (e) { /* noop */ }
        }
        return ok;
    },

    async _push() {
        const meta = this._loadMeta();
        let remoteRaw = {};
        try {
            const { data } = await this._client.from('sync_data').select('data').eq('id', this.getCode()).maybeSingle();
            if (data && data.data) remoteRaw = data.data;
        } catch (e) { remoteRaw = {}; }

        const localRaw = LocalDB.exportForSync();
        const { merged } = this._mergeCollections(localRaw, remoteRaw, meta.fp || {});
        const applied = this._applyMerged(merged, localRaw);

        const now = new Date().toISOString();
        const { error } = await this._client.from('sync_data').upsert(
            { id: this.getCode(), data: merged, updated_at: now },
            { onConflict: 'id' }
        );
        if (error) return { ok: false, applied: false };

        meta.fp = this._fpMap(merged);
        meta.pending = false;
        meta.lastPushedAt = now;
        this._saveMeta();
        return { ok: true, applied };
    },

    async _pull() {
        const meta = this._loadMeta();
        const { data, error } = await this._client
            .from('sync_data')
            .select('data, updated_at')
            .eq('id', this.getCode())
            .maybeSingle();
        if (error || !data || !data.data) return { ok: false, applied: false };

        const remoteRaw = data.data;
        const localRaw = LocalDB.exportForSync();
        const { merged, changed } = this._mergeCollections(localRaw, remoteRaw, meta.fp || {});
        if (!changed) return { ok: true, applied: false };

        const applied = this._applyMerged(merged, localRaw);
        meta.fp = this._fpMap(merged);
        meta.lastPulledAt = new Date().toISOString();
        this._saveMeta();
        return { ok: true, applied };
    },

    _mergeCollections(localRaw, remoteRaw, metaFp) {
        const keys = {};
        Object.keys(localRaw).forEach(k => { keys[k] = 1; });
        Object.keys(remoteRaw).forEach(k => { keys[k] = 1; });

        const merged = {};
        let changed = false;
        Object.keys(keys).forEach(k => {
            const lv = localRaw[k];
            const rv = remoteRaw[k];
            const lfp = lv !== undefined ? fpFnv(lv) : '';
            const lastPushed = metaFp[k] || '';

            if (lv === undefined) {
                merged[k] = rv;
            } else if (rv === undefined) {
                merged[k] = lv;
            } else if (lv === rv) {
                merged[k] = lv;
            } else if (lfp !== lastPushed) {
                merged[k] = lv;
            } else {
                merged[k] = rv;
            }
            if (merged[k] !== lv) changed = true;
        });
        return { merged, changed };
    },

    _applyMerged(merged, localRaw) {
        let applied = false;
        Object.keys(merged).forEach(k => {
            if (localRaw[k] !== merged[k]) {
                localStorage.setItem(k, merged[k]);
                applied = true;
            }
        });
        return applied;
    },

    _fpMap(obj) {
        const m = {};
        Object.keys(obj).forEach(k => { m[k] = fpFnv(obj[k] || ''); });
        return m;
    }
};

function fpFnv(str) {
    let h1 = 0x811c9dc5;
    let h2 = 0x9e3779b9;
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        h1 ^= c;
        h1 = (h1 * 0x01000193) >>> 0;
        h2 ^= c;
        h2 = (h2 * 0x01000193) >>> 0;
    }
    return h1.toString(16) + h2.toString(16);
}
