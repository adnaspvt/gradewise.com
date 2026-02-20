// config.js - Shared Firebase Configuration & App Setup

const firebaseConfig = {
    apiKey: "AIzaSyBjnj-jmPUJzmJvk3hu0vC663xTDusNe-Q",
    authDomain: "easyresults.firebaseapp.com",
    projectId: "easyresults",
    storageBucket: "easyresults.firebasestorage.app",
    messagingSenderId: "336950575713",
    appId: "1:336950575713:web:5a7c5f53c407ffe5ec2020",
    measurementId: "G-D82F2D7CXL"
};

// 1. Initialize Main Firebase App
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Initialize Secondary App (Silently creates users without logging the Admin/Owner out)
let secondaryApp;
if (firebase.apps.length === 1) {
    secondaryApp = firebase.initializeApp(firebaseConfig, "SecondaryApp");
} else {
    secondaryApp = firebase.app("SecondaryApp");
}

// 3. Global Services
const db = firebase.firestore();
const auth = firebase.auth();
const secondaryAuth = secondaryApp.auth();

// PWA: Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('PWA Service Worker Registered Successfully'))
            .catch(err => console.error('PWA Service Worker Registration Failed: ', err));
    });
}