import { TransformFn } from '.'
import ICAL from 'ical.js'

export function updateStatusByPartstat(
  attendeeEmail: string
): TransformFn<ICAL.Event> {
  return event => {
    const attendee = event.attendees?.find(
      attendee => attendee.getFirstParameter('cn') === attendeeEmail
    )

    if (!attendee) {
      return event
    }

    const partstatToStatus = new Map([
      ['TENTATIVE', 'TENTATIVE'],
      ['NEEDS-ACTION', 'TENTATIVE'],
      ['DECLINED', 'CANCELLED'],
    ])

    const partstat = attendee?.getFirstParameter('partstat')
    const updatedStatus = partstat && partstatToStatus.get(partstat)

    if (!updatedStatus) {
      return event
    }

    event.component.updatePropertyWithValue('status', updatedStatus)

    return event
  }
}
