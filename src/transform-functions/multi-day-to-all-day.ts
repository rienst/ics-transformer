import { DateTime } from 'luxon'
import { TransformFn } from '.'
import ICAL from 'ical.js'

export function multiDayToAllDay(
  timeZone = 'Europe/Amsterdam'
): TransformFn<ICAL.Event> {
  return event => {
    if (event.startDate.isDate) {
      return event
    }

    const localStart = DateTime.fromJSDate(event.startDate.toJSDate(), {
      zone: timeZone,
    })
    const localEnd = DateTime.fromJSDate(event.endDate.toJSDate(), {
      zone: timeZone,
    })

    if (!localStart.isValid || !localEnd.isValid) {
      return event
    }

    const isStartLocalMidnight =
      localStart.hour === 0 &&
      localStart.minute === 0 &&
      localStart.second === 0

    const isEndLocalMidnight =
      localEnd.hour === 0 && localEnd.minute === 0 && localEnd.second === 0

    if (!isStartLocalMidnight || !isEndLocalMidnight) {
      return event
    }

    const isSameDay = localStart.hasSame(localEnd, 'day')

    if (isSameDay) {
      return event
    }

    event.startDate = ICAL.Time.fromDateString(localStart.toISODate())
    event.endDate = ICAL.Time.fromDateString(localEnd.toISODate())

    return event
  }
}
