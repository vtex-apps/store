import classNames from 'classnames'
import insane from 'insane'
import { bool, string, oneOf } from 'prop-types'
import { values } from 'ramda'
import React, { memo, useMemo } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import formatIOMessage from '../../../NativeTypes/formatIOMessage'
import useCssHandles from '../../../CssHandles/useCssHandles'

import CallToAction from './CallToAction'
import LinkWrapper from './LinkWrapper'
import {
  textPositionTypes,
  textAlignmentTypes,
  callToActionModeTypes,
  textPostionValues,
  textAlignmentValues,
} from './SchemaTypes'

const justifyTokens = {
  [textPostionValues.LEFT]: 'justify-start',
  [textPostionValues.CENTER]: 'justify-center',
  [textPostionValues.RIGHT]: 'justify-end',
}

const alignTokens = {
  [textAlignmentValues.LEFT]: 'tl',
  [textAlignmentValues.CENTER]: 'tc',
  [textAlignmentValues.RIGHT]: 'tr',
}

const itemsTokens = {
  [textAlignmentValues.LEFT]: 'items-start',
  [textAlignmentValues.CENTER]: 'items-center',
  [textAlignmentValues.RIGHT]: 'items-end',
}

const flexOrderTokens = {
  [textPostionValues.LEFT]: 'flex-row',
  [textPostionValues.RIGHT]: 'flex-row-reverse',
}

const defaultValues = {
  textPosition: textPositionTypes.TEXT_POSITION_LEFT.value,
  textAlignment: textAlignmentTypes.TEXT_ALIGNMENT_LEFT.value,
}

const getEnumValues = enumObject => values(enumObject).map(({ value }) => value)
const getEnumNames = enumObject => values(enumObject).map(({ name }) => name)

const safelyGetToken = (tokenMap, valueWanted, propName) =>
  tokenMap[valueWanted] || defaultValues[propName]

const getImageUrl = (isMobile, imageUrl, mobileImageUrl) =>
  !!mobileImageUrl && isMobile ? mobileImageUrl : imageUrl

const sanitizerConfig = {
  allowedTags: ['p', 'span', 'a', 'div', 'br'],
  allowedAttributes: {
    a: ['class', 'href', 'title', 'target'],
    span: ['class'],
    p: ['class'],
    div: ['class'],
  },
}

const sanitizeHtml = input => (input ? insane(input, sanitizerConfig) : null)

const CSS_HANDLES = [
  'infoCardContainer',
  'infoCardTextContainer',
  'infoCardHeadline',
  'infoCardSubhead',
  'infoCardImageContainer',
  'infoCardImage',
]

const InfoCard = ({
  isFullModeStyle,
  headline,
  subhead,
  callToActionMode,
  callToActionText,
  callToActionUrl,
  textPosition,
  textAlignment,
  imageUrl,
  mobileImageUrl,
  imageActionUrl,
  intl,
  htmlId,
}) => {
  const {
    hints: { mobile },
  } = useRuntime()
  const handles = useCssHandles(CSS_HANDLES)
  const paddingClass =
    textPosition === textPostionValues.LEFT ? 'pr4-ns' : 'pl4-ns'

  // We ignore textAlignment tokens when full image mode
  const alignToken = isFullModeStyle
    ? safelyGetToken(alignTokens, textPosition, 'textPosition')
    : safelyGetToken(alignTokens, textAlignment, 'textAlignment')
  const itemsToken = isFullModeStyle
    ? safelyGetToken(itemsTokens, textPosition, 'textPosition')
    : safelyGetToken(itemsTokens, textAlignment, 'textAlignment')
  const justifyToken = safelyGetToken(
    justifyTokens,
    textPosition,
    'textPosition'
  )
  const flexOrderToken = safelyGetToken(
    flexOrderTokens,
    textPosition,
    'textPosition'
  )

  const finalImageUrl = getImageUrl(
    mobile,
    formatIOMessage({ id: imageUrl, intl }),
    formatIOMessage({ id: mobileImageUrl, intl })
  )

  const containerStyle = isFullModeStyle
    ? { backgroundImage: `url(${finalImageUrl})`, backgroundSize: 'cover' }
    : {}

  const containerClasses = classNames(
    `${handles.infoCardContainer} items-center`,
    {
      [`flex-ns ${flexOrderToken} bg-base ph2-ns pb2 justify-between`]: !isFullModeStyle,
      [`bg-center bb b--muted-4 flex ${justifyToken}`]: isFullModeStyle,
    }
  )

  const textContainerClasses = classNames(
    `${handles.infoCardTextContainer} flex flex-column mw-100`,
    {
      [`w-50-ns ph3-s ${itemsToken} ${paddingClass}`]: !isFullModeStyle,
      [`mh8-ns mh4-s w-40-ns ${itemsToken}`]: isFullModeStyle,
    }
  )

  const headlineClasses = `${handles.infoCardHeadline} t-heading-2 mt6 ${alignToken} c-on-base mw-100`

  const subheadClasses = `${handles.infoCardSubhead} t-body mt6 c-on-base ${alignToken} mw-100`

  const sanitizedHeadline = useMemo(
    () => sanitizeHtml(formatIOMessage({ id: headline, intl })),
    [headline, intl]
  )

  const sanitizedSubhead = useMemo(
    () => sanitizeHtml(formatIOMessage({ id: subhead, intl })),
    [intl, subhead]
  )

  return (
    <LinkWrapper
      imageActionUrl={formatIOMessage({ id: imageActionUrl, intl })}
      extraCondition={!isFullModeStyle}
      linkProps={{ className: 'no-underline' }}
    >
      <div
        className={containerClasses}
        style={containerStyle}
        data-testid="container"
        id={htmlId}
      >
        <div className={textContainerClasses}>
          {headline && (
            <div
              className={headlineClasses}
              dangerouslySetInnerHTML={{ __html: sanitizedHeadline }}
            />
          )}
          {subhead && (
            <div
              className={subheadClasses}
              dangerouslySetInnerHTML={{ __html: sanitizedSubhead }}
            />
          )}
          <CallToAction
            mode={callToActionMode}
            text={formatIOMessage({ id: callToActionText, intl })}
            url={formatIOMessage({ id: callToActionUrl, intl })}
          />
        </div>
        {!isFullModeStyle && (
          <div className={`${handles.infoCardImageContainer} w-50-ns`}>
            <LinkWrapper
              imageActionUrl={formatIOMessage({ id: imageActionUrl, intl })}
            >
              <img
                className={handles.infoCardImage}
                src={finalImageUrl}
                style={{ objectFit: 'cover' }}
                alt=""
                data-testid="half-image"
              />
            </LinkWrapper>
          </div>
        )}
      </div>
    </LinkWrapper>
  )
}

const MemoizedInfoCard = memo(injectIntl(InfoCard))

MemoizedInfoCard.propTypes = {
  blockClass: string,
  isFullModeStyle: bool,
  textPosition: oneOf(getEnumValues(textPositionTypes)),
  headline: string,
  subhead: string,
  callToActionMode: oneOf(getEnumValues(callToActionModeTypes)),
  callToActionText: string,
  callToActionUrl: string,
  imageUrl: string,
  mobileImageUrl: string,
  textAlignment: oneOf(getEnumValues(textAlignmentTypes)),
  imageActionUrl: string,
  intl: intlShape,
  htmlId: string,
}

MemoizedInfoCard.defaultProps = {
  isFullModeStyle: false,
  textPosition: textPositionTypes.TEXT_POSITION_LEFT.value,
  headline: '',
  subhead: '',
  callToActionMode: callToActionModeTypes.CALL_ACTION_BUTTON.value,
  callToActionText: '',
  callToActionUrl: '',
  imageUrl: '',
  mobileImageUrl: '',
  textAlignment: textAlignmentTypes.TEXT_ALIGNMENT_LEFT.value,
}

MemoizedInfoCard.schema = {
  title: 'admin/editor.info-card.title',
  description: 'admin/editor.info-card.description',
  type: 'object',
  properties: {
    isFullModeStyle: {
      title: 'admin/editor.info-card.isFullModeStyle.title',
      description: 'admin/editor.info-card.isFullModeStyle.description',
      type: 'boolean',
      default: false,
      isLayout: true,
    },
    textPosition: {
      title: 'admin/editor.info-card.textPosition.title',
      description: 'admin/editor.info-card.textPosition.description',
      type: 'string',
      enum: getEnumValues(textPositionTypes),
      enumNames: getEnumNames(textPositionTypes),
      default: textPositionTypes.TEXT_POSITION_LEFT.value,
      isLayout: true,
    },
    callToActionMode: {
      title: 'admin/editor.info-card.callToActionMode.title',
      description: 'admin/editor.info-card.callToActionMode.description',
      type: 'string',
      enum: getEnumValues(callToActionModeTypes),
      enumNames: getEnumNames(callToActionModeTypes),
      default: callToActionModeTypes.CALL_ACTION_BUTTON.value,
      isLayout: true,
    },
    textAlignment: {
      title: 'admin/editor.info-card.textAlignment.title',
      description: 'admin/editor.info-card.textAlignment.description',
      type: 'string',
      default: textAlignmentTypes.TEXT_ALIGNMENT_LEFT.value,
      enum: getEnumValues(textAlignmentTypes),
      enumNames: getEnumNames(textAlignmentTypes),
      isLayout: true,
    },
    blockClass: {
      title: 'admin/editor.blockClass.title',
      description: 'admin/editor.blockClass.description',
      type: 'string',
      isLayout: true,
    },
  },
}

export default MemoizedInfoCard
