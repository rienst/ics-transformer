import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateEventByPartstat } from './update-event-by-partstat'

describe('updateStatusByPartstat', () => {
  const attendeeEmail = 'user@example.com'
  const addPropertyWithValue = vi.fn()
  const transformFn = updateEventByPartstat(attendeeEmail)
  let event

  beforeEach(() => {
    event = {
      summary: 'Test event',
      component: {
        addPropertyWithValue,
      },
    }

    addPropertyWithValue.mockClear()
  })

  it('exists', () => {
    expect(updateEventByPartstat).toBeDefined()
  })

  it('returns a function', () => {
    expect(typeof transformFn).toBe('function')
  })

  it('does not prefix the event summary if the user is not an attendee', () => {
    transformFn(event)

    expect(event.summary).toBe('Test event')
  })

  it('does not prefix the event summary if the attendee partstat is ACCEPTED', () => {
    event.attendees = [
      {
        getFirstParameter: (name: string) => {
          if (name === 'cn') {
            return attendeeEmail
          }

          if (name === 'partstat') {
            return 'ACCEPTED'
          }
        },
      },
    ]

    transformFn(event)

    expect(event.summary).toBe('Test event')
  })

  it('does not prefix the event summary if the attendee partstat is DELEGATED', () => {
    event.attendees = [
      {
        getFirstParameter: (name: string) => {
          if (name === 'cn') {
            return attendeeEmail
          }

          if (name === 'partstat') {
            return 'DELEGATED'
          }
        },
      },
    ]

    transformFn(event)

    expect(event.summary).toBe('Test event')
  })

  it('prefixes the event summary if the attendee partstat is NEEDS-ACTION', () => {
    event.attendees = [
      {
        getFirstParameter: (name: string) => {
          if (name === 'cn') {
            return attendeeEmail
          }

          if (name === 'partstat') {
            return 'NEEDS-ACTION'
          }
        },
      },
    ]

    transformFn(event)

    expect(event.summary).toBe('[Uitnodiging] Test event')
  })

  it('prefixes the event summary if the attendee partstat is TENTATIVE', () => {
    event.attendees = [
      {
        getFirstParameter: (name: string) => {
          if (name === 'cn') {
            return attendeeEmail
          }

          if (name === 'partstat') {
            return 'TENTATIVE'
          }
        },
      },
    ]

    transformFn(event)

    expect(event.summary).toBe('[Misschien] Test event')
  })

  it('does not prefix the event summary if the attendee partstat is DECLINED', () => {
    event.attendees = [
      {
        getFirstParameter: (name: string) => {
          if (name === 'cn') {
            return attendeeEmail
          }

          if (name === 'partstat') {
            return 'DECLINED'
          }
        },
      },
    ]

    transformFn(event)

    expect(event.summary).toBe('Test event')
  })

  it('marks the entire event as CANCELLED if the attendee partstat is DECLINED', () => {
    event.attendees = [
      {
        getFirstParameter: (name: string) => {
          if (name === 'cn') {
            return attendeeEmail
          }

          if (name === 'partstat') {
            return 'DECLINED'
          }
        },
      },
    ]

    transformFn(event)

    expect(addPropertyWithValue).toHaveBeenCalledWith('STATUS', 'CANCELLED')
  })
})
