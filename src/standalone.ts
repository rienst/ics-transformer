import { createServer } from 'http'
import { main } from './index'

const server = createServer(async (_, res) => {
  const body = await main()

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/calendar')
  res.end(body)
})

const PORT = 8317

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
)
