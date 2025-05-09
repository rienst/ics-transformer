import { beforeEach, describe, expect, it, vi } from 'vitest'
import { removeDeclined } from './remove-declined'
import ICAL from 'ical.js'

describe('removeDeclined', () => {
  const attendeeEmail = 'user@example.com'
  let events: any[]

  beforeEach(() => {
    events = []
  })

  it('exists', () => {
    expect(removeDeclined).toBeDefined()
  })

  it('does not remove events that have no attendees', () => {
    events.push({
      attendees: [],
    })

    const result = removeDeclined(events, attendeeEmail)

    expect(result).toEqual(events)
  })

  it('does not remove events that have no attendees with the given email', () => {
    events.push({
      attendees: [
        {
          getFirstParameter: (name: string) => {
            if (name === 'cn') {
              return 'otheruser@example.com'
            }

            if (name === 'partstat') {
              return 'ACCEPTED'
            }
          },
        },
      ],
    })

    const result = removeDeclined(events, attendeeEmail)

    expect(result).toEqual(events)
  })

  it('does not remove events that have attendees with the given email that are not declined', () => {
    events.push({
      attendees: [
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
      ],
    })

    const result = removeDeclined(events, attendeeEmail)

    expect(result).toEqual(events)
  })

  it('removes events that have attendees with the given email that are declined', () => {
    events.push({
      attendees: [
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
      ],
    })

    const result = removeDeclined(events, attendeeEmail)

    expect(result).toEqual([])
  })

  it('marks events starting with the same uid as a declined event with an EXDATE property', () => {
    const addPropertyMock = vi.fn()

    const event1 = {
      uid: '12345_1',
      recurrenceId: '12345_1',
      startDate: {
        toICALString: () => '2023-10-01T10:00:00Z',
      },
      attendees: [
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
      ],
      component: {
        addProperty: addPropertyMock,
      },
    }

    const event2 = {
      uid: '12345_2',
      recurrenceId: null,
      attendees: [],
      component: {
        addProperty: addPropertyMock,
      },
    }

    events.push(event1, event2)

    const result = removeDeclined(events, attendeeEmail)

    const exdateProperty = new ICAL.Property('EXDATE')
    exdateProperty.setParameter('TZID', 'Europe/Brussels')
    exdateProperty.setValue('2023-10-01T10:00:00Z')

    expect(result).toEqual([event2])
    expect(addPropertyMock).toHaveBeenCalledTimes(2)
    expect(addPropertyMock).toHaveBeenCalledWith(exdateProperty)
  })
})
