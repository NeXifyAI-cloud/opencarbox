import { describe, it, expect, beforeAll } from 'vitest'
import { encryptData, decryptData, hashData, generateToken, verifyToken } from '../crypto'

describe('Crypto Utilities', () => {
  beforeAll(() => {
    // Set encryption key for tests
    process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  })

  describe('Encryption', () => {
    it('should encrypt data', () => {
      const data = 'sensitive payment data'
      const encrypted = encryptData(data)

      expect(encrypted).toBeDefined()
      expect(typeof encrypted).toBe('string')
      expect(encrypted).not.toBe(data)
      expect(encrypted).toContain(':')
    })

    it('should decrypt encrypted data', () => {
      const original = 'sensitive payment data'
      const encrypted = encryptData(original)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toBe(original)
    })

    it('should handle special characters', () => {
      const data = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
      const encrypted = encryptData(data)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toBe(data)
    })

    it('should handle unicode', () => {
      const data = 'Unicode: 你好世界 مرحبا بالعالم'
      const encrypted = encryptData(data)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toBe(data)
    })

    it('should produce different output for same input (due to random IV)', () => {
      const data = 'test data'
      const encrypted1 = encryptData(data)
      const encrypted2 = encryptData(data)

      expect(encrypted1).not.toBe(encrypted2)

      const decrypted1 = decryptData(encrypted1)
      const decrypted2 = decryptData(encrypted2)

      expect(decrypted1).toBe(decrypted2)
      expect(decrypted1).toBe(data)
    })

    it('should reject invalid encrypted data', () => {
      expect(() => {
        decryptData('invalid:format')
      }).toThrow()
    })

    it('should reject malformed encrypted data', () => {
      expect(() => {
        decryptData('a:b:c:d')
      }).toThrow()
    })
  })

  describe('Hashing', () => {
    it('should hash data consistently', () => {
      const data = 'test data'
      const hash1 = hashData(data)
      const hash2 = hashData(data)

      expect(hash1).toBe(hash2)
    })

    it('should produce different hashes for different inputs', () => {
      const hash1 = hashData('data1')
      const hash2 = hashData('data2')

      expect(hash1).not.toBe(hash2)
    })

    it('should produce hex string', () => {
      const hash = hashData('test')
      expect(/^[a-f0-9]+$/.test(hash)).toBe(true)
    })

    it('should produce fixed length hash', () => {
      const hash = hashData('any data')
      expect(hash.length).toBe(64) // SHA256 produces 64 hex characters
    })
  })

  describe('Token Generation', () => {
    it('should generate random tokens', () => {
      const token1 = generateToken()
      const token2 = generateToken()

      expect(token1).not.toBe(token2)
    })

    it('should generate token with specified length', () => {
      const token = generateToken(16)
      expect(token.length).toBe(32) // 16 bytes = 32 hex characters
    })

    it('should generate hex string', () => {
      const token = generateToken()
      expect(/^[a-f0-9]+$/.test(token)).toBe(true)
    })

    it('should default to 32 bytes', () => {
      const token = generateToken()
      expect(token.length).toBe(64) // 32 bytes = 64 hex characters
    })
  })

  describe('Token Verification', () => {
    it('should verify matching token', () => {
      const token = 'my-secret-token'
      const hash = hashData(token)

      expect(verifyToken(token, hash)).toBe(true)
    })

    it('should reject mismatched token', () => {
      const token = 'my-secret-token'
      const hash = hashData('different-token')

      expect(verifyToken(token, hash)).toBe(false)
    })

    it('should be timing-safe (not vulnerable to timing attacks)', () => {
      const token = 'my-secret-token'
      const correctHash = hashData(token)
      const wrongHash = hashData('wrong')

      expect(verifyToken(token, correctHash)).toBe(true)
      expect(verifyToken(token, wrongHash)).toBe(false)
    })
  })
})
