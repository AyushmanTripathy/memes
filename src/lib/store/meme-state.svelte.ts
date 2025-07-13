import { getFirebaseState } from "$lib/firebase"
import { collection, CollectionReference, Firestore, getDocs, getFirestore, limit, orderBy, query, where } from "firebase/firestore"

export type Meme = {
  title: string
  url: string
  description: string
  subreddit: string
  nsfw: boolean
  index: number
}

const BATCH_SIZE = 10
export const LAST_SEEN_INDEX_KEY = "lastSeenMemeIndex"

class MemeState {
  static instance: MemeState
  db: Firestore
  collection: CollectionReference
  fetching = $state(false)
  lastSeenIndex: number = $state(0)

  memes: Meme[] = $state([])

  constructor() {
    const firebaseState = getFirebaseState()
    this.db = getFirestore(firebaseState.app)
    this.collection = collection(this.db, "memes")

    const index = localStorage.getItem(LAST_SEEN_INDEX_KEY)
    if (index && Number.isFinite(Number(index)))
      this.lastSeenIndex = Number(index)
    else {
      this.lastSeenIndex = 0
      localStorage.setItem(LAST_SEEN_INDEX_KEY, String(this.lastSeenIndex))
    }
  }

  fetchOne = async (): Promise<Meme> => {
    const filterIndex = this.lastSeenIndex++

    this.memes = this.memes.filter(x => x.index >= filterIndex)
    if (this.memes.length)
      return this.memes[0]

    const q = query(this.collection, orderBy("index"), where("index", ">", filterIndex), limit(BATCH_SIZE))
    const querySnapshot = await getDocs(q)

    return new Promise((res, rej) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Meme
        res(data)
        this.memes.push(data)
      })
    })
  }
}

export function getMemeState(): MemeState {
  if (!MemeState.instance) {
    MemeState.instance = new MemeState()
  }
  return MemeState.instance
}
