export async function openDB(name = 'topholidays', version = 1): Promise<IDBDatabase> {
  return await new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv')
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function dbPut(key: string, value: unknown) {
  const db = await openDB()
  return await new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readwrite')
    tx.objectStore('kv').put(value as any, key)
    tx.oncomplete = () => resolve(true)
    tx.onerror = () => reject(tx.error)
  })
}

export async function dbGet<T=unknown>(key: string) {
  const db = await openDB()
  return await new Promise<T | undefined>((resolve, reject) => {
    const tx = db.transaction('kv', 'readonly')
    const req = tx.objectStore('kv').get(key)
    req.onsuccess = () => resolve(req.result as T)
    req.onerror = () => reject(req.error)
  })
}