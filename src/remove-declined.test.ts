import { beforeEach, describe, expect, it } from 'vitest'
import { removeDeclined } from './remove-declined'

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
})
