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

const UserDataPixel: FC = () => {
  const { push } = usePixel()

  useEffect(() => {
    getSessionPromiseFromWindow().then((data: SessionResponse) => {
      const profileFields = data?.response?.namespaces?.profile
      if (!profileFields) {
        return
      }
      const userData = fields.reduce(
        (acc, key) => {
          const value = profileFields[key]?.value as string | undefined
          if (value) {
            if (key === 'isAuthenticated') {
              acc[key] = toBoolean(value)
            } else {
              acc[key] = value
            }
          }
          return acc
        },
        {} as Record<string, string | boolean>
      )
      
      push({
        event: 'userData',
        data: userData,
      })
    })
  }, [])

  return null
}

export default UserDataPixel
