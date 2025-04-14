import { ObjectId } from 'mongodb'
export function convertToObjectId(id: string) {
  return new ObjectId(id)
}

export function generateOrderCode() {
  const prefix = 'ORD'
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substr(2, 5).toUpperCase() // ví dụ: 5 ký tự
  return `${prefix}${date}${random}`
}
