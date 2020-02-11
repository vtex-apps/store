import React, { FC, memo, useState, Fragment, useCallback } from 'react'
import Button from '../../../../Styleguide/Button'
import IOMessage from '../../../../NativeTypes/IOMessage'
import { SliderLayout } from 'vtex.slider-layout'
import { findIndex, propEq } from 'ramda'
import classnames from 'classnames'
// import useProduct from 'vtex.product-context/useProduct'
import useProduct from '../../../../ProductContext/useProduct'

import { stripUrl, isColor, slug } from '../utils'
import styles from '../styles.css'
import { DisplayVariation, DisplayMode } from '../types'
import { imageUrlForSize, VARIATION_IMG_SIZE } from '../../module/images'
import ErrorMessage from './ErrorMessage'
import SelectModeVariation from './SelectVariationMode'
import SelectorItem from './SelectorItem'

interface Props {
  variation: DisplayVariation
  maxSkuPrice?: number | null
  seeMoreLabel: string
  maxItems: number
  selectedItem: string | null
  showValueForVariation: boolean
  imageHeight?: number
  imageWidth?: number
  showBorders?: boolean
  showLabel: boolean
  containerClasses?: string
  showErrorMessage: boolean
  mode?: string
  sliderDisplayThreshold: number
  sliderArrowSize: number
  sliderItemsPerPage: any
}

const ITEMS_VISIBLE_THRESHOLD = 2

const findSelectedOption = (selectedItem: string | null) =>
  findIndex(propEq('label', selectedItem))

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const Variation: FC<Props> = ({
  mode = 'default',
  maxItems,
  showLabel,
  variation,
  imageWidth,
  imageHeight,
  showBorders,
  maxSkuPrice,
  seeMoreLabel,
  selectedItem,
  showErrorMessage,
  showValueForVariation,
  containerClasses: containerClassesProp,
  sliderArrowSize,
  sliderDisplayThreshold,
  sliderItemsPerPage,
}) => {
  const { name, options } = variation

  const visibleItemsWhenCollapsed = maxItems - ITEMS_VISIBLE_THRESHOLD

  const [showAll, setShowAll] = useState(() => {
    const selectedOptionPosition = findSelectedOption(selectedItem)(options)
    return selectedOptionPosition >= visibleItemsWhenCollapsed
  })

  const {
    buyButton = {
      clicked: false,
    },
  } = useProduct()

  const displayImage = isColor(name)

  const shouldCollapse = !showAll && options.length > maxItems

  const overflowQuantity = options.length - visibleItemsWhenCollapsed
  const displayOptions = options.slice(
    0,
    shouldCollapse ? visibleItemsWhenCollapsed : options.length
  )
  const showAllAction = useCallback(() => setShowAll(true), [setShowAll])
  const containerClasses = classnames(
    'flex flex-column',
    containerClassesProp,
    styles.skuSelectorSubcontainer,
    `${styles.skuSelectorSubcontainer}--${slug(name)}`
  )

  const shouldUseSlider =
    displayOptions.length > sliderDisplayThreshold &&
    mode === DisplayMode.slider

  const sliderConfigurationProps = {
    itemsPerPage: sliderItemsPerPage,
    infinite: true,
    showNavigationArrows: 'always',
    showPaginationDots: 'never',
    arrowSize: sliderArrowSize,
    fullWidth: false,
  }

  const selectorItemsArray = displayOptions.map(option => {
    return (
      <SelectorItem
        isSelected={option.label === selectedItem}
        key={`${option.label}-${name}`}
        isAvailable={option.available}
        maxPrice={maxSkuPrice}
        onClick={option.impossible ? noop : option.onSelectItem}
        isImage={displayImage}
        variationValue={option.label}
        imageHeight={imageHeight}
        imageWidth={imageWidth}
        showBorders={showBorders}
        imageUrl={
          option.image &&
          imageUrlForSize(stripUrl(option.image.imageUrl), VARIATION_IMG_SIZE)
        }
        imageLabel={option.image && option.image.imageLabel}
        isImpossible={option.impossible}
      />
    )
  })

  return (
    <div className={containerClasses}>
      <div className={`${styles.skuSelectorNameContainer} ma1`}>
        <div className={`${styles.skuSelectorTextContainer} db mb3`}>
          {showLabel && (
            <span
              className={`${styles.skuSelectorName} c-muted-1 t-small overflow-hidden`}
            >
              {name}
              {showErrorMessage && buyButton.clicked && !selectedItem && (
                <ErrorMessage />
              )}
            </span>
          )}
          {selectedItem && showValueForVariation && (
            <Fragment>
              <span
                className={`${styles.skuSelectorNameSeparator} c-muted-1 t-small`}
              >
                :{' '}
              </span>
              <span
                className={`${styles.skuSelectorSelectorImageValue} c-muted-1 t-small`}
              >
                {selectedItem}
              </span>
            </Fragment>
          )}
        </div>
        <div
          className={`${styles.skuSelectorOptionsList} w-100 inline-flex flex-wrap ml2 items-center`}
        >
          {mode === DisplayMode.select && !displayImage ? (
            <SelectModeVariation
              selectedItem={selectedItem}
              displayOptions={displayOptions}
            />
          ) : shouldUseSlider ? (
            <SliderLayout {...sliderConfigurationProps}>
              {selectorItemsArray}
            </SliderLayout>
          ) : (
            selectorItemsArray
          )}
          {!showAll && shouldCollapse && (
            <div className={styles.seeMoreButton}>
              <Button
                variation="tertiary"
                onClick={showAllAction}
                size="small"
                collapseLeft
              >
                <IOMessage
                  id={seeMoreLabel}
                  values={{ quantity: overflowQuantity }}
                  data-testid="seeMoreLabel"
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(Variation)
