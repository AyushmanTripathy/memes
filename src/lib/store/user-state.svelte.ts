import { goto } from "$app/navigation"
import { page } from "$app/state"
import { getFirebaseState } from "$lib/firebase"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, type Auth, type User } from "firebase/auth"
import { collection, doc, DocumentReference, getDoc, getFirestore, setDoc, updateDoc, type CollectionReference, type Firestore } from "firebase/firestore"
import { getMemeState, LAST_SEEN_INDEX_KEY, type Meme } from "./meme-state.svelte"

export interface UserDoc {
  uid: string
  name: string
  photoURL: string
  email: string
  liked: number[]
  disliked: number[]
  lastRatedIndex: number
}

class UserState {
  static instance: UserState
  db: Firestore
  auth: Auth
  docRef: DocumentReference | null = null
  userDoc: UserDoc | null = $state(null)
  loading = $state(false)
  user: User | null = $state(null)

  constructor() {
    const firebaseState = getFirebaseState()
    this.db = getFirestore(firebaseState.app)
    this.auth = getAuth(firebaseState.app)
  }

  ensureLogin = async () => {
    this.loading = true
    onAuthStateChanged(this.auth, async (user) => {
      const memeState = getMemeState()
      const searchParams = new URLSearchParams()
      searchParams.set('redirect', page.url.pathname)
      if (!user?.uid) {
        this.loading = false
        await goto('/auth/login?' + searchParams.toString())
        return;
      }

      try {
        this.docRef = doc(this.db, "users", user?.uid);
        this.userDoc = (await getDoc(this.docRef)).data() as UserDoc;
        if (!this.userDoc) {
          this.userDoc = {
            uid: user?.uid || "",
            name: user?.displayName || "",
            email: user?.email || "",
            photoURL: user?.photoURL || "",
            liked: [],
            disliked: [],
            lastRatedIndex: memeState.lastSeenIndex || 0,
          }
          console.log("user doc not found, creating new")
          await setDoc(this.docRef, { ...this.userDoc });
        }
        this.user = user
      } catch (e: any) {
        console.error("while syncing user doc", e)
      } finally {
        this.loading = false
      }
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
    try {
      localStorage.setItem(LAST_SEEN_INDEX_KEY, String(meme.index))

      if (!this.userDoc || !this.docRef) throw 'User doc or ref not found'
      if (this.userDoc.liked.includes(meme.index) || this.userDoc.disliked.includes(meme.index))
        throw "Meme already rated"

      if (liked)
        this.userDoc.liked.push(meme.index)
      else
        this.userDoc.disliked.push(meme.index)

      this.userDoc.lastRatedIndex = meme.index

      await updateDoc(this.docRef, { ...this.userDoc })
    } catch (e) {
      console.error("failed to rate meme", e)
    }
  }
}

export function getUserState(): UserState {
  if (!UserState.instance) {
    UserState.instance = new UserState()
  }
  return UserState.instance
}

