interface SendLogOptions {
  message: string
  searchIndex?: string
  environment?: string
  body?: string
}

export async function sendErrorLog(
  options: SendLogOptions
): Promise<Response | void> {
  if (!options?.searchIndex) {
    return null
  }

  const { message, searchIndex, environment = 'production', body } = options

  const severityText = 'ERROR'
  const severityNumber = 17
  const timeUnixNano = (Date.now() * 1000000).toString()
  const observedTimeUnixNano = timeUnixNano

  const traceId = [...crypto.getRandomValues(new Uint8Array(16))]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  const spanId = [...crypto.getRandomValues(new Uint8Array(8))]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  let hostname = ''
  let path = ''
  let url = ''

  if (typeof window !== 'undefined' && window.location) {
    hostname = window.location.hostname
    path = window.location.pathname
    url = window.location.href
  }

  const payload = {
    resourceLogs: [
      {
        resource: {
          attributes: [
            {
              key: '_msg',
              value: {
                stringValue: message ?? 'Log message',
              },
            },
            {
              key: 'hostname',
              value: {
                stringValue: hostname,
              },
            },
            {
              key: 'path',
              value: {
                stringValue: path,
              },
            },
            {
              key: 'environment',
              value: {
                stringValue: environment,
              },
            },
            {
              key: 'browserInfos',
              value: {
                stringValue: JSON.stringify({
                  url,
                  hostname,
                  path,
                }),
              },
            },
            {
              key: 'searchParams',
              value: {
                stringValue:
                  typeof window !== 'undefined' && window.location
                    ? window.location.search
                    : '',
              },
            },
          ],
        },
        scopeLogs: [
          {
            scope: {},
            logRecords: [
              {
                timeUnixNano,
                observedTimeUnixNano,
                severityText,
                severityNumber,
                attributes: [
                  {
                    key: 'vtex.search_index',
                    value: {
                      stringValue: searchIndex,
                    },
                  },
                  {
                    key: 'body',
                    value: {
                      stringValue: body ?? message ?? 'Log message',
                    },
                  },
                ],
                traceId,
                spanId,
              },
            ],
          },
        ],
      },
    ],
  }

  try {
    const response = await fetch(
      'https://stable.vtexobservability.com/v1/logs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
    return response
  } catch (error) {
    console.error('Erro ao enviar log:', error)
  }
}
