import React from 'react'
import { Link } from 'vtex.render-runtime'
import useDevice from '../DeviceDetector/useDevice'
import classnames from 'classnames'
import useCssHandles from '../CssHandles/useCssHandles'
import styles from './styles.css'

const CSS_HANDLES = ['imgRegular', 'img', 'bannerLink'] as const

export interface Props {
  /** The image of the banner */
  image: string
  /** Link for the mobile image of the banner */
  mobileImage: string
  /** The description of the image */
  description: string
  /** Max height size of the banner */
  height: number
  /** The url where the image is pointing to, in case of external route */
  url: string
  /** The page where the image is pointing to */
  page: string
  /** Params of the url */
  params: string
  /** Indicates if the route is external or not */
  externalRoute: boolean
  /** The url where the image is pointing to, in case of internal route (optional) */
  customInternalURL: string
  /** Runtime injected deps */
  runtime: any,
  /** Link for the tablet image of the banner */
  tabletImage: string
}

function getParams(params: string) {
  const json: { [s: string]: string } = {}
  if (params) {
    const array = params.split(',')
    array.forEach(item => {
      const pair = item.split('=')
      json[pair[0]] = pair[1]
    })
    return json
  }
  return null
}

const Banner = (props: Props) => {
  const {
    url,
    page,
    image,
    params,
    mobileImage,
    tabletImage,
    height = 420,
    externalRoute,
    description = '',
    customInternalURL,
  } = props

  const { isMobile, device } = useDevice()
  const handles = useCssHandles(CSS_HANDLES)

  const content = (
    <div className={classnames(styles.containerImg, 'w-100')}>
      <div
        className={classnames(
          handles.imgRegular,
          'flex items-center justify-center'
        )}
        style={{ maxHeight: height }}
      >
        <img
          className={classnames(handles.img, 'w-100 h-100')}
          src={device === "tablet" ? tabletImage || image : isMobile && mobileImage ? mobileImage : image}
          alt={description}
        />
      </div>
    </div>
  )

  if (!externalRoute) {
    return page || customInternalURL ? (
      <Link
        className={classnames(handles.bannerLink, 'w-100')}
        page={customInternalURL ? undefined : page}
        params={getParams(params)}
        to={customInternalURL || undefined}
      >
        {content}
      </Link>
    ) : (
      content
    )
  }

  return (
    <a
      className={classnames(handles.bannerLink, 'w-100')}
      href={url}
      target="_blank"
    >
      {content}
    </a>
  )
}

export default Banner
