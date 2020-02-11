export const translate = (id, intl) => {
  return intl.formatMessage({ id: `${id}` })
}
