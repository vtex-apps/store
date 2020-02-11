const getProfileFromQueryResponse = data => {
  if (!data || !data.getProfile || !data.getProfile.profile) return null

  const { email, firstName } = data.getProfile.profile
  if (!email) {
    return null
  }

  return {
    email,
    firstName,
  }
}

const getProfileFromApiResponse = data => {
  if (!data || !data.namespaces) {
    return null
  }

  const { namespaces: { profile } = {} } = data
  if (!profile) {
    return null
  }

  const {
    email: { value: email } = { value: null },
    firstName: { value: firstName } = { value: null },
  } = profile

  if (!email) {
    return null
  }

  return {
    email,
    firstName,
  }
}

export const getProfile = data => {
  if (!data) return null

  if (data.getSession) return getProfileFromQueryResponse(data)

  if (data.namespaces) return getProfileFromApiResponse(data)

  return null
}
