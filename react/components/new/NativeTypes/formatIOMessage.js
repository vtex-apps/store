const formatIOMessage = (
  { intl, ...messageDescriptor },
  values
) => {
  const { id } = messageDescriptor

  const intlMessage = intl.messages[id]

  if (intlMessage) {
    return intl.formatMessage(messageDescriptor, values)
  }

  if (intlMessage === '') {
    return ''
  }

  return id
}

export default formatIOMessage