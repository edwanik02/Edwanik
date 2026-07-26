import { formatCurrency, slugify, buildWhatsAppURL, buildOrderWhatsAppMessage } from '../../src/utils'

describe('formatCurrency', () => {
  it('formats INR correctly', () => { const r = formatCurrency(499); expect(r).toContain('499'); expect(r).toContain('₹') })
  it('handles zero', () => expect(formatCurrency(0)).toContain('0'))
})

describe('slugify', () => {
  it('converts spaces to dashes', () => expect(slugify('Teddy Bear')).toBe('teddy-bear'))
  it('removes special characters', () => expect(slugify('RC Car (Pro)')).toBe('rc-car-pro'))
})

describe('buildWhatsAppURL', () => {
  it('strips non-digits from number', () => { const url = buildWhatsAppURL('+91 9876543210', 'Hi'); expect(url).toContain('919876543210') })
  it('encodes message', () => { const url = buildWhatsAppURL('+919876543210', 'Hello World'); expect(url).toContain(encodeURIComponent('Hello World')) })
})

describe('buildOrderWhatsAppMessage', () => {
  it('includes product name and total', () => {
    const msg = buildOrderWhatsAppMessage([{ name: 'Teddy', qty: 2, price: 499 }], 998, 'Arjun')
    expect(msg).toContain('Teddy'); expect(msg).toContain('×2'); expect(msg).toContain('Arjun')
  })
})
