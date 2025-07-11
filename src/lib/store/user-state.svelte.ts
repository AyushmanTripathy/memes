import { goto } from "$app/navigation"
import { page } from "$app/state"
import { getFirebaseState } from "$lib/firebase"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, type Auth, type User } from "firebase/auth"
import { collection, getFirestore, type CollectionReference, type Firestore } from "firebase/firestore"

class UserState {
  static instance: UserState
  db: Firestore
  auth: Auth
  collection: CollectionReference
  loading = $state(false)
  user: User | null = $state(null)

  constructor() {
    const firebaseState = getFirebaseState()
    this.db = getFirestore(firebaseState.app)
    this.auth = getAuth(firebaseState.app)
    this.collection = collection(this.db, "users")
  }

  ensureLogin = async () => {
    onAuthStateChanged(this.auth, (user) => {
      const searchParams = new URLSearchParams()
      searchParams.set('redirect', page.url.pathname)
      if (!user) goto('/auth/login?' + searchParams.toString())
      this.user = user
    })
  }

  login = async () => {
    const provider = new GoogleAuthProvider()
    return await signInWithPopup(this.auth, provider)
  }
}

export function getUserState(): UserState {
  if (!UserState.instance) {
    UserState.instance = new UserState()
  }
  return UserState.instance
}

