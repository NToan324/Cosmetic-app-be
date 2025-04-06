export function expirationOtp(time: number): String {
  const dateNow = new Date()
  const expiration = formatTime(new Date(dateNow.getTime() + time * 60 * 1000))
  return expiration
}

export function formatTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Ho_Chi_Minh'
  }

  return date.toLocaleString('en-US', options)
}
