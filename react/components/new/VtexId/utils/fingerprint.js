import Fingerprint from 'fingerprintjs2'
import promiseDelay from './promise-delay'

const defaultOptions = {
  preprocessor: null,
  fonts: {
    swfContainerId: 'fingerprintjs2',
    swfPath: 'flash/compiled/FontList.swf',
    userDefinedFonts: [],
    extendedJsFonts: false,
  },
  screen: {
    detectScreenOrientation: true,
  },
  plugins: {
    sortPluginsFor: [/palemoon/i],
    excludeIE: true,
  },
  extraComponents: [],
  excludes: {
    enumerateDevices: true,
    pixelRatio: true,
    doNotTrack: true,
    fonts: true,
    fontsFlash: true,
    audio: true,
    canvas: true,
    webgl: true,
    webglVendorAndRenderer: true,
    webdriver: true,
    cpuClass: true,
    availableScreenResolution: true,
    timezoneOffset: true,
    timezone: true,
  },
  NOT_AVAILABLE: 'not available',
  ERROR: 'error',
  EXCLUDED: 'excluded',
}

function hexString(buffer) {
  const byteArray = new Uint8Array(buffer)

  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16)
    const paddedHexCode = hexCode.padStart(2, '0')
    return paddedHexCode
  })

  return hexCodes.join('')
}

function canUseNativeHash() {
  return window.crypto && window.crypto.subtle && window.crypto.subtle.digest
}

async function nativeHash(message) {
  if (!canUseNativeHash()) return null
  try {
    const encoder = new TextEncoder()
    const data = await window.crypto.subtle.digest(
      'SHA-256',
      encoder.encode(message)
    )
    return hexString(data)
  } catch (error) {
    console.error(error)
    return null
  }
}

async function getFingerprint(options = null) {
  let attemps = 3
  const opt = options ? { ...defaultOptions, ...options } : defaultOptions
  while (attemps > 0) {
    attemps--
    const components = await Fingerprint.getPromise(opt)
    if (components) {
      const serializedComponents = components
        .map(c => `${c.key}:${c.value.toString()}`)
        .join(';')
      if (canUseNativeHash()) {
        const hash = await nativeHash(serializedComponents)
        return hash
      }
      const hash = Fingerprint.x64hash128(serializedComponents, 31)
      return hash
    }
  }
  return null
}

export async function get(options) {
  await promiseDelay(150)
  return Promise.race([promiseDelay(50), getFingerprint(options)])
}
