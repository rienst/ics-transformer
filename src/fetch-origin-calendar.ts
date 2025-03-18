import ICAL from 'ical.js'

export interface FetchOriginCalendarOptions {
  url: string
  fetch?: typeof fetch
  parser?: (text: string) => ICAL.Component
}

export async function fetchOriginCalendar(
  options: FetchOriginCalendarOptions
): Promise<ICAL.Component> {
  const fetchFn = options.fetch || fetch
  const parserFn =
    options.parser || ((text: string) => new ICAL.Component(ICAL.parse(text)))

  const response = await fetchFn(options.url)
  const body = await response.text()

  return parserFn(body)
}
