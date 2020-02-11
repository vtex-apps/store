export const SOCIAL_TO_ENUM = {
  facebook: 'Facebook',
  whatsapp: 'WhatsApp',
  twitter: 'Twitter',
  telegram: 'Telegram',
  googleplus: 'Google+',
  email: 'E-mail',
  pinterest: 'Pinterest',
}

export const SOCIAL_ENUM = Object.values(SOCIAL_TO_ENUM)

export const SOCIAL_ENUM_TO_COMPONENT = {
  [SOCIAL_TO_ENUM.facebook]: 'Facebook',
  [SOCIAL_TO_ENUM.twitter]: 'Twitter',
  [SOCIAL_TO_ENUM.telegram]: 'Telegram',
  [SOCIAL_TO_ENUM.googleplus]: 'GooglePlus',
  [SOCIAL_TO_ENUM.whatsapp]: 'Whatsapp',
  [SOCIAL_TO_ENUM.email]: 'Email',
  [SOCIAL_TO_ENUM.pinterest]: 'Pinterest',
}
