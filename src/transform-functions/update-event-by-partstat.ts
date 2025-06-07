import { TransformFn } from '.'
import ICAL from 'ical.js'

export function updateEventByPartstat(
  attendeeEmail: string
): TransformFn<ICAL.Event> {
  return event => {
    const attendee = event.attendees?.find(
      attendee => attendee.getFirstParameter('cn') === attendeeEmail
    )

    if (!attendee) {
      return event
    }

    const partstatToLabel = new Map([
      ['TENTATIVE', 'Misschien'],
      ['NEEDS-ACTION', 'Uitnodiging'],
    ])

    const partstat = attendee?.getFirstParameter('partstat')

    if (partstat === 'DECLINED') {
      event.component.addPropertyWithValue('STATUS', 'CANCELLED')
    }

    const label = partstat && partstatToLabel.get(partstat)

    if (!label) {
      return event
    }

    event.summary = [`[${label}]`, event.summary].join(' ')

    return event
  }
}
