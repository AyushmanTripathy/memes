// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSpMd3gth_Y7tiJlNnUm8w1dy3xZzbL-g",
  authDomain: "memes-cdb85.firebaseapp.com",
  projectId: "memes-cdb85",
  storageBucket: "memes-cdb85.firebasestorage.app",
  messagingSenderId: "625622424109",
  appId: "1:625622424109:web:a29188cdbb95d75d72f6a4",
  measurementId: "G-4WGRRMKLE9"
};

class FirebaseState {
  static instance: FirebaseState
  app: FirebaseApp

  constructor(config: Record<string, string>) {
    this.app = initializeApp(config)
  }
}

export function setFirebaseState() {
  if (FirebaseState.instance)
    throw "FirebaseState duplicate set"
  FirebaseState.instance = new FirebaseState(firebaseConfig)
  return FirebaseState.instance
}

export function getFirebaseState(): FirebaseState {
  if (!FirebaseState.instance) {
    FirebaseState.instance = new FirebaseState(firebaseConfig)
  }
  return FirebaseState.instance
}
