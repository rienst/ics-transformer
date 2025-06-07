import { updateEventByPartstat } from './transform-functions/update-event-by-partstat'
import { transformMany } from './transform-functions'
import { multiDayToAllDay } from './transform-functions/multi-day-to-all-day'
import { fetchOriginCalendar } from './fetch-origin-calendar'
import ICAL from 'ical.js'
import { LambdaFunctionURLHandler } from 'aws-lambda'

const ORIGIN_URL = process.env.ORIGIN_URL
const ATTENDEE_EMAIL = process.env.ATTENDEE_EMAIL
const TIMEZONE = process.env.TIMEZONE || 'Europe/Amsterdam'

export async function main() {
  console.log(
    `Starting calendar transformation for ${ATTENDEE_EMAIL} from ${ORIGIN_URL}`
  )

  if (!ORIGIN_URL || !ATTENDEE_EMAIL) {
    throw new Error(
      'Missing env variables: ' +
        JSON.stringify(
          {
            ORIGIN_URL: ORIGIN_URL || null,
            ATTENDEE_EMAIL: ATTENDEE_EMAIL || null,
          },
          null,
          2
        )
    )
  }

  const calendar = await fetchOriginCalendar({ url: ORIGIN_URL })

  console.log(
    `Fetched calendar with ${
      calendar.getAllSubcomponents('vevent').length
    } events`
  )

  const events = calendar
    .getAllSubcomponents('vevent')
    .map(component => new ICAL.Event(component))

  transformMany(events, [
    updateEventByPartstat(ATTENDEE_EMAIL),
    multiDayToAllDay(TIMEZONE),
  ])

  calendar.removeAllSubcomponents('vevent')
  events.forEach(event => calendar.addSubcomponent(event.component))

  console.log(`Transformed calendar with ${events.length} events`)

  return ICAL.stringify(calendar.jCal)
}

export const handler: LambdaFunctionURLHandler = async () => {
  const body = await main()

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/calendar' },
    body,
  }
}
