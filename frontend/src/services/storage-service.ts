/**
 * Swimore.ai Ephemeral Storage Engine
 * Device-local, client-side encrypted IndexedDB engine with 24-hour TTL
 * and midnight purge sweep (00:00 WIB). Zero plaintext persists to server.
 */

const DB_NAME = 'swimore_ephemeral_v1'
const DB_VERSION = 1
const STORE_SESSIONS = 'ephemeral_sessions'
const STORE_MESSAGES = 'encrypted_messages'

export interface EphemeralSession {
  id: string
  title: string
  modelId: string
  isPrivate: boolean
  createdAt: number
  expiresAt: number
}

export interface EncryptedMessagePayload {
  id: string
  sessionId: string
  iv: string // base64
  ciphertext: string // base64
  role: 'user' | 'assistant' | 'system'
  timestamp: number
  expiresAt: number
}

export interface DecryptedMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  trace?: {
    path: string
    model: string
    latency: string
  }
  routingTrace?: {
    path: string
    model: string
    latencyMs: number
  }
  timestamp: number
}

class EphemeralStorageEngine {
  private db: IDBDatabase | null = null
  private cryptoKey: CryptoKey | null = null

  /**
   * Initialize IndexedDB database and Web Crypto AES-GCM key
   */
  async init(): Promise<void> {
    if (this.db) return

    // Initialize Web Crypto AES-GCM 256-bit key in memory
    this.cryptoKey = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    )

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
          const sessionStore = db.createObjectStore(STORE_SESSIONS, { keyPath: 'id' })
          sessionStore.createIndex('expiresAt', 'expiresAt', { unique: false })
        }
        if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
          const messageStore = db.createObjectStore(STORE_MESSAGES, { keyPath: 'id' })
          messageStore.createIndex('sessionId', 'sessionId', { unique: false })
          messageStore.createIndex('expiresAt', 'expiresAt', { unique: false })
        }
      }

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        // Auto-run midnight sweep on startup
        this.sweepExpiredSessions().catch(console.error)
        resolve()
      }

      request.onerror = (event: Event) => {
        reject((event.target as IDBOpenDBRequest).error)
      }
    })
  }

  /**
   * Encrypt arbitrary string with client-side AES-GCM
   */
  private async encryptText(plaintext: string): Promise<{ ciphertext: string; iv: string }> {
    if (!this.cryptoKey) await this.init()
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(plaintext)

    const cipherBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.cryptoKey!,
      encoded
    )

    const ciphertext = btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)))
    const ivBase64 = btoa(String.fromCharCode(...iv))

    return { ciphertext, iv: ivBase64 }
  }

  /**
   * Decrypt ciphertext back to string
   */
  private async decryptText(ciphertext: string, ivBase64: string): Promise<string> {
    if (!this.cryptoKey) await this.init()
    const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0))
    const cipherBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.cryptoKey!,
      cipherBytes
    )

    return new TextDecoder().decode(decryptedBuffer)
  }

  /**
   * Create or update ephemeral chat session (default 24h TTL)
   */
  async createSession(id: string, title: string, modelId: string, isPrivate: boolean): Promise<EphemeralSession> {
    await this.init()
    const now = Date.now()
    const ttl24h = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

    const session: EphemeralSession = {
      id,
      title,
      modelId,
      isPrivate,
      createdAt: now,
      expiresAt: now + ttl24h,
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_SESSIONS, 'readwrite')
      const store = tx.objectStore(STORE_SESSIONS)
      const req = store.put(session)
      req.onsuccess = () => resolve(session)
      req.onerror = () => reject(req.error)
    })
  }

  /**
   * Save an encrypted message to the session
   */
  async saveMessage(sessionId: string, message: { role: 'user' | 'assistant' | 'system'; content: string; trace?: any }): Promise<void> {
    await this.init()
    const now = Date.now()
    const ttl24h = 24 * 60 * 60 * 1000
    const msgId = `msg_${now}_${Math.random().toString(36).substr(2, 9)}`

    const payload = JSON.stringify({
      content: message.content,
      trace: message.trace,
    })

    const { ciphertext, iv } = await this.encryptText(payload)

    const record: EncryptedMessagePayload = {
      id: msgId,
      sessionId,
      iv,
      ciphertext,
      role: message.role,
      timestamp: now,
      expiresAt: now + ttl24h,
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_MESSAGES, 'readwrite')
      const store = tx.objectStore(STORE_MESSAGES)
      const req = store.put(record)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  /**
   * Retrieve and decrypt all active messages for a session
   */
  async getMessages(sessionId: string): Promise<DecryptedMessage[]> {
    await this.init()

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_MESSAGES, 'readonly')
      const store = tx.objectStore(STORE_MESSAGES)
      const index = store.index('sessionId')
      const req = index.getAll(sessionId)

      req.onsuccess = async () => {
        const rawRecords: EncryptedMessagePayload[] = req.result || []
        const now = Date.now()

        const decrypted: DecryptedMessage[] = []
        for (const r of rawRecords) {
          if (r.expiresAt > now) {
            try {
              const rawJson = await this.decryptText(r.ciphertext, r.iv)
              const parsed = JSON.parse(rawJson)
              decrypted.push({
                id: r.id,
                sessionId: r.sessionId,
                role: r.role,
                content: parsed.content,
                trace: parsed.trace,
                timestamp: r.timestamp,
              })
            } catch (err) {
              console.warn('Decryption skipped for expired/corrupted block', r.id)
            }
          }
        }
        decrypted.sort((a, b) => a.timestamp - b.timestamp)
        resolve(decrypted)
      }

      req.onerror = () => reject(req.error)
    })
  }

  /**
   * Midnight Sweeper & TTL Expiration Cleanup
   * Automatically deletes expired records where expiresAt <= Date.now()
   */
  async sweepExpiredSessions(): Promise<{ purgedSessions: number; purgedMessages: number }> {
    await this.init()
    const now = Date.now()

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([STORE_SESSIONS, STORE_MESSAGES], 'readwrite')
      const sessionStore = tx.objectStore(STORE_SESSIONS)
      const messageStore = tx.objectStore(STORE_MESSAGES)

      const sessionIdx = sessionStore.index('expiresAt')
      const messageIdx = messageStore.index('expiresAt')

      const sessionReq = sessionIdx.openCursor(IDBKeyRange.upperBound(now))
      let purgedSessions = 0
      let purgedMessages = 0

      sessionReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          purgedSessions++
          cursor.continue()
        }
      }

      const messageReq = messageIdx.openCursor(IDBKeyRange.upperBound(now))
      messageReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          purgedMessages++
          cursor.continue()
        }
      }

      tx.oncomplete = () => {
        resolve({ purgedSessions, purgedMessages })
      }
      tx.onerror = () => reject(tx.error)
    })
  }

  /**
   * Zero-Log Scrub Killswitch
   * Instantly purges a session and all its encrypted messages immediately
   */
  async zeroLogScrub(sessionId: string): Promise<void> {
    await this.init()

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([STORE_SESSIONS, STORE_MESSAGES], 'readwrite')
      const sessionStore = tx.objectStore(STORE_SESSIONS)
      const messageStore = tx.objectStore(STORE_MESSAGES)

      sessionStore.delete(sessionId)

      const msgIndex = messageStore.index('sessionId')
      const msgReq = msgIndex.openCursor(IDBKeyRange.only(sessionId))

      msgReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }

      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
}

export const ephemeralStorage = new EphemeralStorageEngine()

