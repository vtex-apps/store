const fields = [
  'firstName',
  'lastName',
  'document',
  'id',
  'email',
  'phone',
  'isAuthenticated',
] as const

export interface SessionResponse {
  response: {
    id: string
    namespaces: {
      account?: {
        accountName?: {
          value: string
        }
        id?: {
          value: string
        }
      }
      profile?: {
        firstName?: {
          value: string
        }
        lastName?: {
          value: string
        }
        document?: {
          value: string
        }
        id?: {
          value: string
        }
        email?: {
          value: string
        }
        phone?: {
          value: string
        }
        isAuthenticated?: {
          value: string
        }
      }
    }
  }
}

export const getSessionPromiseFromWindow: any = () =>
  !(window as any).__RENDER_8_SESSION__ ||
  !(window as any).__RENDER_8_SESSION__.sessionPromise
    ? Promise.resolve(null)
    : (window as any).__RENDER_8_SESSION__.sessionPromise

const toBoolean = (value: string) => value.toLowerCase() === 'true'

export function getUserData(
  profileFields: SessionResponse['response']['namespaces']['profile']
) {
  if (!profileFields) {
    return {}
  }

  return fields.reduce<Record<string, string | boolean>>((acc, key) => {
    const value = profileFields[key]?.value

    if (value) {
      acc[key] = key === 'isAuthenticated' ? toBoolean(value) : value
    }

    return acc
  }, {})
}
