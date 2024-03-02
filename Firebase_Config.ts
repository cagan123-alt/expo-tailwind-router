import { initializeApp } from "firebase/app"
import {getAuth, initializeAuth,getReactNativePersistence } from "firebase/auth";
import {getDatabase} from "firebase/database";
import {getFirestore} from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA8R4DRPdJTqybzMTd0t8tpliw3wKRtms",
  authDomain: "cay-app.firebaseapp.com",
  databaseURL: "https://cay-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cay-app",
  storageBucket: "cay-app.appspot.com",
  messagingSenderId: "253468709820",
  appId: "1:253468709820:web:a01e7e3de487efcab591b9",
  measurementId: "G-QX80QCZPXM"
};

// Initialize Firebase
export const Firebase_app = initializeApp(firebaseConfig);
export const Firebase_auth = initializeAuth(Firebase_app,{
  persistence:getReactNativePersistence(ReactNativeAsyncStorage)
})
export const Firebase_db = getDatabase(Firebase_app);
export const Firebase_firestore = getFirestore(Firebase_app);