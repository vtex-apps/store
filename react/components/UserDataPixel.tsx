import { useEffect, FC } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'

import {
  getSessionPromiseFromWindow,
  getUserData,
  SessionResponse,
} from '../hooks/getUserData'

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
