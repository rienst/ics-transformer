import ICAL from 'ical.js'

export function removeDeclined(events: ICAL.Event[], attendeeEmail: string) {
  return events.filter(
    event =>
      !event.attendees.some(attendee => {
        const email = attendee.getFirstParameter('cn')
        const partstat = attendee.getFirstParameter('partstat')

        return email === attendeeEmail && partstat === 'DECLINED'
      })
  )
}
