import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { fetchOriginCalendar } from './fetch-origin-calendar'

describe('fetchOriginCalendar', () => {
  let fetchMock: Mock
  let parserMock: Mock

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      text: vi.fn().mockResolvedValue('response text'),
    })
    parserMock = vi.fn().mockResolvedValue('parsed response')
  })

  it('exists', () => {
    expect(fetchOriginCalendar).toBeDefined()
  })

  it('calls fetch with the provided URL', async () => {
    const url = 'https://example.com'
    await fetchOriginCalendar({
      url,
      fetch: fetchMock,
      parser: vi.fn(),
    })
    expect(fetchMock).toHaveBeenCalledWith(url)
  })

  it('returns the parsed response', async () => {
    const url = 'https://example.com'
    const result = await fetchOriginCalendar({
      url,
      fetch: fetchMock,
      parser: parserMock,
    })
    expect(result).toBe('parsed response')
  })
})
