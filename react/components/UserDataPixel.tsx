import { useEffect, FC } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'

const fields = ['firstName', 'lastName', 'document', 'id', 'email', 'phone', 'isAuthenticated'] as const

interface SessionResponse {
  response: {
    namespaces: {
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

const getSessionPromiseFromWindow: any = () =>
  !(window as any).__RENDER_8_SESSION__ || !(window as any).__RENDER_8_SESSION__.sessionPromise
    ? Promise.resolve(null)
    : (window as any).__RENDER_8_SESSION__.sessionPromise

const toBoolean = (value: string) => value.toLowerCase() === 'true'

function getUserData(profileFields: SessionResponse['response']['namespaces']['profile']) {
  if (!profileFields) {
    return {}
  }

  return fields.reduce<Record<string, string | boolean>>(
    (acc, key) => {
      const value = profileFields[key]?.value

      if (value) {
        acc[key] = key === 'isAuthenticated'
          ? toBoolean(value)
          : value
      }

      return acc
    },
    {}
  )
}

const UserDataPixel: FC = () => {
  const { push } = usePixel()

  useEffect(() => {
    getSessionPromiseFromWindow().then((data: SessionResponse) => {
      const profileFields = data?.response?.namespaces?.profile

      if (!profileFields) {
        return
      }

      const userData = getUserData(profileFields)

      push({
        event: 'userData',
        ...userData,
      })
    })
  }, [push])

  return null
}

export default UserDataPixel
