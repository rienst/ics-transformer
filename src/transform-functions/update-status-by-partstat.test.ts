import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateStatusByPartstat } from './update-status-by-partstat'

describe('updateStatusByPartstat', () => {
  const attendeeEmail = 'user@example.com'
  const transformFn = updateStatusByPartstat(attendeeEmail)
  let event

  beforeEach(() => {
    event = {
      component: {
        updatePropertyWithValue: vi.fn(),
      },
    }
  })

  it('exists', () => {
    expect(updateStatusByPartstat).toBeDefined()
  })

  it('returns a function', () => {
    expect(typeof transformFn).toBe('function')
  })

  it('does not change the event status if the user is not an attendee', () => {
    transformFn(event)

    expect(event.component.updatePropertyWithValue).not.toHaveBeenCalled()
  })

  it('does not change the event if the attendee partstat is ACCEPTED', () => {
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

    expect(event.component.updatePropertyWithValue).not.toHaveBeenCalled()
  })

  it('does not change the event if the attendee partstat is not DELEGATED', () => {
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

    expect(event.component.updatePropertyWithValue).not.toHaveBeenCalled()
  })

  it('changes the event status to TENTATIVE if the attendee partstat is NEEDS-ACTION', () => {
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

    expect(event.component.updatePropertyWithValue).toHaveBeenCalledWith(
      'status',
      'TENTATIVE'
    )
  })

  it('changes the event status to TENTATIVE if the attendee partstat is TENTATIVE', () => {
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

    expect(event.component.updatePropertyWithValue).toHaveBeenCalledWith(
      'status',
      'TENTATIVE'
    )
  })

  it('changes the event status to CANCELLED if the attendee partstat is DECLINED', () => {
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

    expect(event.component.updatePropertyWithValue).toHaveBeenCalledWith(
      'status',
      'CANCELLED'
    )
  })
})
