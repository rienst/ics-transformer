import ICAL from 'ical.js'

export function removeDeclined(events: ICAL.Event[], attendeeEmail: string) {
  let transformedEvents = [...events]

  transformedEvents.forEach(event => {
    const isDeclined = event.attendees.some(attendee => {
      const email = attendee.getFirstParameter('cn')
      const partstat = attendee.getFirstParameter('partstat')

      return email === attendeeEmail && partstat === 'DECLINED'
    })

    if (!isDeclined) {
      return
    }

    const hasRelatedRecurringEvents = !!event.recurrenceId

    if (!hasRelatedRecurringEvents) {
      return
    }

    const exdateProperty = new ICAL.Property('EXDATE')
    exdateProperty.setParameter('TZID', 'Europe/Brussels')
    exdateProperty.setValue(event.startDate.toICALString())

    const eventsWithSameUidStart = transformedEvents.filter(e =>
      e.uid.startsWith(event.uid.split('_')[0])
    )

    eventsWithSameUidStart.forEach(relatedEvent => {
      relatedEvent.component.addProperty(exdateProperty)
    })
  })

  return transformedEvents.filter(
    event =>
      !event.attendees.some(attendee => {
        const email = attendee.getFirstParameter('cn')
        const partstat = attendee.getFirstParameter('partstat')

        return email === attendeeEmail && partstat === 'DECLINED'
      })
  )
}
