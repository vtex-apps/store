import { changeImageUrlSize } from './generateUrl'

type AspectRatio = string | number

/** Parses ratio values into a multiplier to set the image height.
 * For example, turns "3:4" into 1.333, so the image height will be 
 * 1.333 times its width.
*/
const parseAspectRatio = (input?: AspectRatio | null) => {
  if (!input) {
    return null
  }
  if (typeof input === 'string') {
    if (input === 'auto') { 
      return null
    }
    const separator = ':'
    const data = input.split(separator)
    if (data.length !== 2) {
      return null
    }

    const [ width, height ] = data
    const ratio = parseFloat(height) / parseFloat(width)

    if (typeof ratio !== 'number' || isNaN(ratio)) {
      return null
    }

    return ratio
  }

  if (typeof input === 'number') {
    return input
  }

  return null
}

export const imageUrl = (src: string, size: number, maxSize: number, aspectRatio?: AspectRatio) => {
  let width = size
  let height: number | string = 'auto'

  if (aspectRatio && aspectRatio !== 'auto') {
    height = size * (parseAspectRatio(aspectRatio) || 1)

    if (width > maxSize) {
      height = height / (width / maxSize) 
      width = maxSize
    }

    if (height > maxSize) {
      width = width / (height / maxSize)
      height = maxSize
    }

    width = Math.round(width)
    height = Math.round(height)
  } else {
    width = Math.min(maxSize, width)
  }

  return changeImageUrlSize(src, width, height)
}
