export async function deriveKey(password: string) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('unique-salt-per-user'), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt','decrypt']
  )
}

export async function encryptData(data: unknown, password: string) {
  const key = await deriveKey(password)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder().encode(JSON.stringify(data))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc)
  return { encrypted: new Uint8Array(encrypted), iv }
}

export async function decryptData(payload: { encrypted: Uint8Array; iv: Uint8Array }, password: string) {
  const key = await deriveKey(password)
  const dec = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: payload.iv as unknown as BufferSource },
    key,
    payload.encrypted as unknown as BufferSource,
  )
  return JSON.parse(new TextDecoder().decode(dec))
}

export const encryptionService = {
  async encryptUserData(data: unknown, passwordHash: string) {
    return encryptData(data, passwordHash)
  },
  async decryptUserData(payload: { encrypted: Uint8Array; iv: Uint8Array }, passwordHash: string) {
    return decryptData(payload, passwordHash)
  },
  async encryptSettingsData(data: unknown, passwordHash: string) {
    return encryptData(data, passwordHash)
  },
  async decryptSettingsData(payload: { encrypted: Uint8Array; iv: Uint8Array }, passwordHash: string) {
    return decryptData(payload, passwordHash)
  },
}
