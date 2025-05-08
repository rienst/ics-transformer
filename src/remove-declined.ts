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

    console.log('\nevent is declined:', event.uid)

    const hasRecurrenceId = !!event.recurrenceId

    if (!hasRecurrenceId) {
      return
    }

    console.log('event has recurrence id:', event.recurrenceId.toICALString())

    const relatedEvents = transformedEvents.filter(recurringEvent =>
      recurringEvent.uid.startsWith(event.uid.split('_')[0])
    )

    relatedEvents.forEach(initialRecurringEvent => {
      const exdateProperty = new ICAL.Property('EXDATE')
      exdateProperty.setParameter('TZID', 'Europe/Brussels')
      exdateProperty.setValue(event.startDate.toICALString())

      initialRecurringEvent.component.addProperty(exdateProperty)
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
