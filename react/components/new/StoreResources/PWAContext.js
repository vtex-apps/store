import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Helmet } from 'vtex.render-runtime'
import { graphql } from 'react-apollo'
import {usePixel} from '../PixelContext/PixelContext'

import pwaData from './queries/pwaData.gql'

const PWAContext = React.createContext(null)

const PWAProvider = ({ rootPath, children, data = {} }) => {
  const { manifest, iOSIcons, splashes, pwaSettings, loading, error } = data
  const { push } = usePixel()

  const deferredPrompt = useRef(null)
  /* beforeinstallprompt event is fired even after the userChoice is to cancel (and there is no need to re-render) */
  const captured = useRef(false)

  const [alreadyInstalled, setAlreadyInstalled] = useState(false)
  const [installDismissed, setInstallDismissed] = useState(false)


  useEffect(() => {
    const handleBeforeInstall = e => {
      const { promptOnCustomEvent, disablePrompt } = pwaSettings
      if (promptOnCustomEvent !== 'default' && !captured.current) {
        e.preventDefault()

        if (disablePrompt) {
          return false
        }

        deferredPrompt.current = e
        captured.current = true
        return false
      }
      return true
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () =>
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [captured, pwaSettings])

  useEffect( () => {
    const webAppInstalled = localStorage.getItem('webAppInstalled')
    if (webAppInstalled) {
      setAlreadyInstalled(webAppInstalled)
    }
    const webAppInstallDismissed = localStorage.getItem('webAppInstallDismissed')
    if (webAppInstallDismissed) {
      setInstallDismissed(webAppInstallDismissed)
    }
  }, [])

  const showInstallPrompt = useCallback(() => {
    const prompt = deferredPrompt.current
    if (prompt) {
      prompt.prompt()
      prompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          localStorage.setItem('webAppInstalled', 'true')
        } else {
          localStorage.setItem('webAppInstallDismissed', 'true')
        }
        push({
          event: 'installWebApp',
          userChoice: choiceResult.outcome
        })
        deferredPrompt.current = null
      })
    }
  }, [])

  const context = useMemo( () => {
    if (pwaSettings) {
      const { disablePrompt, promptOnCustomEvent } = pwaSettings
      /* browsers for ios devices doesn't support install prompt */
      const isIOS = navigator && !!navigator.userAgent.match(/(iPod|iPhone|iPad)/)

      return {
        showInstallPrompt,
        settings: {
          promptOnCustomEvent: (disablePrompt || isIOS || installDismissed || alreadyInstalled) ? '' 
            : promptOnCustomEvent
        }
      }
    }
  }, [showInstallPrompt, pwaSettings, alreadyInstalled])

  const hasManifest = !loading && manifest && !error

  return (
    <PWAContext.Provider value={context}>
      {hasManifest && (
        <Helmet
          meta={[
            { name: 'theme-color', content: manifest.theme_color },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
          ]}
          link={[
            {
              rel: 'manifest',
              href: `${rootPath}/pwa/manifest.json`,
            },
            ...(iOSIcons
              ? iOSIcons.map(icon => ({
                rel: 'apple-touch-icon',
                sizes: icon.sizes,
                href: `${rootPath}${icon.src}`,
              }))
              : []),
            ...(splashes
              ? splashes.map(splash => ({
                href: `${rootPath}${splash.src}`,
                sizes: splash.sizes,
                rel: 'apple-touch-startup-image',
              }))
              : []),
          ].filter(Boolean)}
        />
      )}
      {children}
    </PWAContext.Provider>
  )
}

const usePWA = () => {
  return useContext(PWAContext)
}

const options = {
  options: () => ({
    ssr: false,
  }),
}

export default { PWAContext, PWAProvider: graphql(pwaData, options)(PWAProvider), usePWA }
