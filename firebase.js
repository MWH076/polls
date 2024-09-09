const firebaseConfig = {
    apiKey: "AIzaSyCJNFM3D7AatdbqD0BHqlIE4uF15ZTmrLM",
    authDomain: "polls-dade8.firebaseapp.com",
    projectId: "polls-dade8",
    storageBucket: "polls-dade8.appspot.com",
    messagingSenderId: "481467677318",
    appId: "1:481467677318:web:0474803cae4f0795236f07"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
