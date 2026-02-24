import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 32

// Get encryption key from environment
function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY

  if (!keyHex) {
    throw new Error('ENCRYPTION_KEY environment variable not set')
  }

  const key = Buffer.from(keyHex, 'hex')

  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)')
  }

  return key
}

/**
 * Encrypt data using AES-256-GCM
 * Returns: salt:iv:authTag:encryptedData (all base64 encoded)
 */
export function encryptData(data: string): string {
  try {
    const key = getEncryptionKey()
    const salt = crypto.randomBytes(SALT_LENGTH)
    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    // Format: base64(salt):base64(iv):base64(authTag):hex(encrypted)
    return (
      salt.toString('base64') +
      ':' +
      iv.toString('base64') +
      ':' +
      authTag.toString('base64') +
      ':' +
      encrypted
    )
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Decrypt data that was encrypted with encryptData
 */
export function decryptData(encrypted: string): string {
  try {
    const key = getEncryptionKey()
    const parts = encrypted.split(':')

    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format')
    }

    const [saltB64, ivB64, authTagB64, encryptedHex] = parts
    const salt = Buffer.from(saltB64, 'base64')
    const iv = Buffer.from(ivB64, 'base64')
    const authTag = Buffer.from(authTagB64, 'base64')

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Encrypt payment-related data
 */
export function encryptPaymentData(data: string): string {
  return encryptData(data)
}

/**
 * Decrypt payment-related data
 */
export function decryptPaymentData(encrypted: string): string {
  return decryptData(encrypted)
}

/**
 * Hash sensitive data (one-way, non-reversible)
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Verify a token matches a hash
 */
export function verifyToken(token: string, hash: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(hashData(token)), Buffer.from(hash))
}
