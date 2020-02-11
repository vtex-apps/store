import { changeImageUrlSize } from './generateUrl'

const thumbnailSize = 160

export default function generateImageConfig (image) {
  return {
    imageUrl: image.imageUrl,
    thumbnailUrl: changeImageUrlSize(image.imageUrl, thumbnailSize),
    imageText: image.imageText,
    imageLabel: image.imageLabel,
  }
}