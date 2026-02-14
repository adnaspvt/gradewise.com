// cloud-adapter.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// --- CONFIG (Paste your keys here or import from firebase-config.js) ---
// We assume firebase-config.js handles the app initialization and exposes 'window.cloud'
// If not, paste the config here.

// --- OWNER AUTH ---
// The Owner is a special hardcoded check or a specific Firebase User.
// For simplicity, we will keep the hardcoded check for the Owner Portal login
// but use Firebase for the data.

// --- UNIVERSAL FUNCTIONS ---

// 1. Upload Image (Base64) to Storage
window.uploadImage = async (path, dataUrl) => {
    if(!dataUrl || !dataUrl.startsWith('data:')) return null;
    try {
        const storageRef = ref(window.cloud.storage, path);
        await uploadString(storageRef, dataUrl, 'data_url');
        return await getDownloadURL(storageRef);
    } catch(e) { console.error("Upload failed", e); return null; }
};

// 2. Fetch Collection with Filters
window.fetchCollection = async (colName, filterField, filterVal) => {
    const db = window.cloud.db;
    let q = collection(db, colName);
    if(filterField) q = query(q, where(filterField, "==", filterVal));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// 3. Generic Add/Update/Delete
window.addToCloud = async (col, data) => {
    return (await addDoc(collection(window.cloud.db, col), { ...data, createdAt: new Date().toISOString() })).id;
};
window.updateCloud = async (col, id, data) => {
    await updateDoc(doc(window.cloud.db, col, id), data);
};
window.deleteFromCloud = async (col, id) => {
    if(confirm("Permanently delete?")) await deleteDoc(doc(window.cloud.db, col, id));
};

// --- OWNER SPECIFIC FUNCTIONS ---

// Create Institution (Just data, no Auth User needed yet)
window.createInstitution = async (data) => {
    // 1. Upload Logo if exists
    if(data.logoRaw) {
        data.profileImage = await window.uploadImage(`logos/${Date.now()}_logo.png`, data.logoRaw);
        delete data.logoRaw;
    }
    // 2. Add to Firestore
    await addDoc(collection(window.cloud.db, 'institutions'), data);
};

// Update Global Site Config
window.saveSiteConfig = async (config) => {
    // We use a fixed ID 'global_config' for the site settings
    const ref = doc(window.cloud.db, 'site_config', 'main');
    // Handle Logo Upload
    if(config.brandLogo && config.brandLogo.startsWith('data:')) {
        config.brandLogo = await window.uploadImage('site/global_logo.png', config.brandLogo);
    }
    await setDoc(ref, config, { merge: true });
};

// Fetch Global Config
window.getSiteConfig = async () => {
    const snap = await getDoc(doc(window.cloud.db, 'site_config', 'main'));
    return snap.exists() ? snap.data() : {};
};