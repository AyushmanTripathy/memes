import { getFirebaseState } from "$lib/firebase"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, type Auth } from "firebase/auth"
import { collection, getFirestore, type CollectionReference, type Firestore } from "firebase/firestore"

export type User = {
  id: string
  name: string
  memeRatings: {
    [id: string]: boolean
  }
}

class UserState {
  static instance: UserState
  db: Firestore
  auth: Auth
  collection: CollectionReference
  loading = $state(false)

  constructor() {
    const firebaseState = getFirebaseState()
    this.db = getFirestore(firebaseState.app)
    this.auth = getAuth(firebaseState.app)
    this.collection = collection(this.db, "users")
  }

  ensureLogin = async () => {
    onAuthStateChanged(this.auth, (user) => {
      console.log("user", user)
    })
  }

  login = async () => {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(this.auth, provider)
      .then((result) => {
        console.log("end", result)
      })
  }
}

export function getUserState(): UserState {
  if (!UserState.instance) {
    UserState.instance = new UserState()
  }
  return UserState.instance
}

