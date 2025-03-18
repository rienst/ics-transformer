import { beforeEach, describe, expect, it, vi } from 'vitest'
import { multiDayToAllDay } from './multi-day-to-all-day'

describe('multiDayToAllDay', () => {
  let event

  beforeEach(() => {
    event = {}
  })

  it('exists', () => {
    expect(multiDayToAllDay).toBeDefined()
  })

  it('returns a function', () => {
    expect(typeof multiDayToAllDay()).toBe('function')
  })

  it('leaves the event unchanged if it is already an all-day event', () => {
    event.startDate = {
      isDate: true,
    }
    const transformFn = multiDayToAllDay()
    const result = transformFn(event)

    expect(result).toEqual(event)
  })

  it('leaves the event unchanged if it does not start and end at 00:00', () => {
    event.startDate = {
      toJSDate: () => new Date('2021-01-01T12:00:00Z'),
    }

    event.endDate = {
      toJSDate: () => new Date('2021-01-02T12:00:00Z'),
    }

    const transformFn = multiDayToAllDay()
    const result = transformFn(event)

    expect(result).toEqual(event)
  })

  it('does not transform the event to an all-day event if it starts and ends at 00:00 on different days', () => {
    event.startDate = {
      toJSDate: () => new Date('2020-12-31T23:00:00Z'),
    }

    event.endDate = {
      toJSDate: () => new Date('2020-12-31T23:00:00Z'),
    }

    const transformFn = multiDayToAllDay()
    const result = transformFn(event)

    expect(result).toEqual(event)
  })

  it('transforms the event to an all-day event if it starts and ends at 00:00 on different days', () => {
    event.startDate = {
      toJSDate: () => new Date('2020-12-31T23:00:00Z'),
    }

    event.endDate = {
      toJSDate: () => new Date('2021-01-01T23:00:00Z'),
    }

    const transformFn = multiDayToAllDay('Europe/Amsterdam')
    const result = transformFn(event)

    expect(result.startDate.toICALString()).toBe('20210101')
    expect(result.endDate.toICALString()).toBe('20210102')
  })
})
