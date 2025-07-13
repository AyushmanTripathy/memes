import { goto } from "$app/navigation"
import { page } from "$app/state"
import { getFirebaseState } from "$lib/firebase"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, type Auth, type User } from "firebase/auth"
import { collection, getFirestore, type CollectionReference, type Firestore } from "firebase/firestore"
import type { Meme } from "./meme-state.svelte"

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
    this.loading = true
    onAuthStateChanged(this.auth, (user) => {
      const searchParams = new URLSearchParams()
      searchParams.set('redirect', page.url.pathname)
      this.loading = false
      if (!user) goto('/auth/login?' + searchParams.toString())
      this.user = user
    })
  }

  login = async () => {
    try {
      this.loading = true
      const provider = new GoogleAuthProvider()
      return await signInWithPopup(this.auth, provider)
    } catch (e: any) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  logout = async () => {
    try {
      if (!this.user) {
        console.log("User already logouted out")
        return
      }

      this.loading = true
      await this.auth.signOut()
      this.user = null
    } catch (e: any) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  rateMeme = async (liked: boolean, meme: Meme) => {
    console.log("meme", meme, "liked", liked)
  }
}

export function getUserState(): UserState {
  if (!UserState.instance) {
    UserState.instance = new UserState()
  }
  return UserState.instance
}

