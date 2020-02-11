import React from 'react'
import IOMessage from '../NativeTypes/IOMessage'
import useCssHandles from '../CssHandles/useCssHandles'

import SocialNetwork from './components/SocialNetwork'

interface SocialNetworkData {
  url: string
  name: string
}

interface Props {
  title?: string
  socialNetworks: SocialNetworkData[]
  showInColor: boolean
}

const CSS_HANDLES = [
  'socialNetworksTitle',
  'socialNetworksContainer',
  'socialNetworkWrapper',
]

const SocialNetworks: StorefrontFunctionComponent<Props> = ({
  title,
  showInColor,
  socialNetworks = [],
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.socialNetworkWrapper}>
      {title && (
        <div className={`${handles.socialNetworksTitle} mb4`}>
          <IOMessage id={title} />
        </div>
      )}
      <div className={`${handles.socialNetworksContainer} nh2 flex`}>
        {socialNetworks.map(socialNetworkData => (
          <SocialNetwork
            key={socialNetworkData.name + socialNetworkData.url}
            showInColor={showInColor}
            url={socialNetworkData.url}
            name={socialNetworkData.name}
          />
        ))}
      </div>
    </div>
  )
}

SocialNetworks.schema = {
  title: 'admin/editor.footer.socialNetworks.title',
  description: 'admin/editor.footer.socialNetworks.description',
  type: 'object',
  properties: {
    showInColor: {
      default: false,
      isLayout: true,
      title: 'admin/editor.footer.showSocialNetworksInColor.title',
      type: 'boolean',
    },
  },
}

export default SocialNetworks
