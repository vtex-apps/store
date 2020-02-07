import React from 'react'
import { injectIntl, InjectedIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import withImage from './withImage'

interface SocialNetworkProps {
  imageSrc: string
  showInColor: boolean
  url: string
  name: string
  intl: InjectedIntl
}

const CSS_HANDLES = ['socialNetworkLink', 'socialNetworkImage'] as const

/**
 * Shows an image for an specific social network
 */
const SocialNetwork: React.FC<SocialNetworkProps> = ({
  imageSrc,
  url,
  name,
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  if (!imageSrc) {
    return null
  }

  const normalizedName = String(name).toLowerCase()

  return (
    <a
      href={formatIOMessage({ id: url, intl })}
      target="_blank"
      rel="noopener noreferrer"
      className={`${handles.socialNetworkLink} ${applyModifiers(
        handles.socialNetworkLink,
        normalizedName
      )} c-muted-1 w2 h2 mh2 flex items-center`}
    >
      <img
        className={`${handles.socialNetworkImage} ${applyModifiers(
          handles.socialNetworkImage,
          normalizedName
        )}`}
        src={imageSrc}
        alt={formatIOMessage({ id: name, intl })}
        title={formatIOMessage({ id: name, intl })}
      />
    </a>
  )
}

SocialNetwork.displayName = 'SocialNetwork'

const getImagePathFromProps = ({ name, showInColor }: SocialNetworkProps) =>
  `${name.toLowerCase()}${showInColor ? '' : '-bw'}.svg`

export default withImage(getImagePathFromProps)(injectIntl(SocialNetwork))
