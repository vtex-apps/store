import slugify from 'slugify'

export default function slug(str: string) {
  const replaced = (str && str.replace(/[*+~.()'"!:@&\[\]]/g, '')) || ''
  const slugified = slugify(replaced, { lower: true }) || ''
  return slugified
}