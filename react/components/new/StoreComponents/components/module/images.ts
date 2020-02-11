import { head } from 'ramda'

export const imageUrlForSize = (imageUrl: string, size: number) => {
  if (!imageUrl) {
    return ''
  }
  const urlSplitted = imageUrl.split('/')
  const idsStringIdx = urlSplitted.findIndex(content => content === 'ids')
  if (idsStringIdx < 0 || idsStringIdx === urlSplitted.length - 1)
    return imageUrl
  const sizeStringIdx = idsStringIdx + 1
  const sizeString = urlSplitted[sizeStringIdx]
  const imageId = head(sizeString.split('-'))
  const newSizeString = `${imageId}-${size * 2}-auto`
  return [
    ...urlSplitted.slice(0, sizeStringIdx),
    newSizeString,
    ...urlSplitted.slice(sizeStringIdx + 1),
  ].join('/')
}

export const VARIATION_IMG_SIZE = 40
export const IMAGE_DEFAULT_SIZE = 900
export const THUMB_SIZE = 150
