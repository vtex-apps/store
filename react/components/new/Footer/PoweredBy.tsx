import React from 'react'
import useCssHandles from '../CssHandles/useCssHandles'
import { withRuntimeContext } from 'vtex.render-runtime'

import withImage from './components/withImage'
import { PLATFORM_GOCOMMERCE } from './modules/platformCode'

const CSS_HANDLES = ['poweredBy', 'poweredByImage', 'poweredByLink']

/**
 * "Powered By VTEX/GoCommerce" image component, used in Footer
 */
const PoweredBy: StorefrontFunctionComponent<PoweredByProps> = ({
  imageSrc,
  runtime,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  if (!imageSrc) {
    return null
  }

  if (runtime.platform === PLATFORM_GOCOMMERCE) {
    return (
      <a
        href="https://www.gocommerce.com/?utm_source=store_footer"
        className={handles.poweredByLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={`${handles.poweredBy} flex items-center w4`}>
          <img
            className={`${handles.poweredByImage} w-100`}
            src={imageSrc}
            alt="GoCommerce"
          />
        </div>
      </a>
    )
  }

  return (
    <div className={`${handles.poweredBy} flex items-center h3 w3`}>
      <img
        className={`${handles.poweredByImage} w-100`}
        src={imageSrc}
        alt="VTEX"
      />
    </div>
  )
}

interface PoweredByProps extends PoweredBySchema {
  runtime: {
    platform: string
  }
  logoUrl: string
  imageSrc: string
}

interface PoweredBySchema {
  showInColor: boolean
}

PoweredBy.displayName = 'PoweredBy'

const getImagePathFromProps = ({ runtime, showInColor }: PoweredByProps) =>
  `${runtime.platform}${showInColor ? '' : '-bw'}.svg`

export default withRuntimeContext(withImage(getImagePathFromProps)(PoweredBy))
