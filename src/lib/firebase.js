import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvqzZdVUCUd1zgKYXfgkU4c0x3rgLCQBo",
  authDomain: "anara-foods.firebaseapp.com",
  projectId: "anara-foods",
  storageBucket: "anara-foods.firebasestorage.app",
  messagingSenderId: "694074597149",
  appId: "1:694074597149:web:d7e043dff635ce907dcbf4",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.app().firestore();
