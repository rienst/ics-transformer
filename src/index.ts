import { updateStatusByPartstat } from './transform-functions/update-status-by-partstat'
import { transformMany } from './transform-functions'
import { multiDayToAllDay } from './transform-functions/multi-day-to-all-day'
import { fetchOriginCalendar } from './fetch-origin-calendar'
import ICAL from 'ical.js'
import { removeDeclined } from './remove-declined'
import { LambdaFunctionURLHandler } from 'aws-lambda'

const ORIGIN_URL = process.env.ORIGIN_URL
const ATTENDEE_EMAIL = process.env.ATTENDEE_EMAIL
const TIMEZONE = process.env.TIMEZONE

export const handler: LambdaFunctionURLHandler = async () => {
  if (!ORIGIN_URL || !ATTENDEE_EMAIL || !TIMEZONE) {
    throw new Error(
      'Missing env variables' +
        JSON.stringify({ ORIGIN_URL, ATTENDEE_EMAIL, TIMEZONE }, null, 2)
    )
  }

  const calendar = await fetchOriginCalendar({ url: ORIGIN_URL })

  const events = calendar
    .getAllSubcomponents('vevent')
    .map(component => new ICAL.Event(component))

  transformMany(events, [
    updateStatusByPartstat(ATTENDEE_EMAIL),
    multiDayToAllDay(),
  ])

  const nonDeclinedEvents = removeDeclined(events, ATTENDEE_EMAIL)

  calendar.removeAllSubcomponents('vevent')
  nonDeclinedEvents.forEach(event => calendar.addSubcomponent(event.component))

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/calendar' },
    body: ICAL.stringify(calendar.jCal),
  }
}
