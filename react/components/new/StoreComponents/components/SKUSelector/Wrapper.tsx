import React, { useMemo, useEffect } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { pick } from 'ramda'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'
import {
  MaybeResponsiveInput,
  ResponsiveInput,
  useResponsiveValues,
} from 'vtex.responsive-values'

import SKUSelector from './index'
import { Variations, InitialSelectionType, DisplayMode } from './types'
import { ShowValueForVariation } from './components/SKUSelector'

const getVariationsFromItems = (
  skuItems: ProductItem[],
  visibleVariations?: string[]
) => {
  const variations: Variations = {}
  const variationsSet: Record<string, Set<string>> = {}

  for (const skuItem of skuItems) {
    for (const currentVariation of skuItem.variations) {
      const { name, values } = currentVariation
      if (
        !visibleVariations ||
        visibleVariations.includes(name.toLowerCase().trim())
      ) {
        const value = values[0]
        const currentSet = variationsSet[name] || new Set()
        currentSet.add(value)
        variationsSet[name] = currentSet
      }
    }
  }
  const variationsNames = Object.keys(variationsSet)
  // Transform set back to array
  for (const variationName of variationsNames) {
    const set = variationsSet[variationName]
    variations[variationName] = Array.from(set)
  }
  return variations
}

const getVariationsFromSpecifications = (
  skuSpecifications: SkuSpecification[],
  visibleVariations?: string[]
) => {
  const variations: Variations = {}
  for (const specification of skuSpecifications) {
    if (
      !visibleVariations ||
      visibleVariations.includes(specification.field.name.toLowerCase().trim())
    ) {
      variations[specification.field.name] = specification.values.map(
        value => value.name
      )
    }
  }
  return variations
}

const useVariations = (
  skuItems: ProductItem[],
  skuSpecifications: SkuSpecification[],
  shouldNotShow: boolean,
  visibleVariations?: string[]
) => {
  const isSkuSpecificationsEmpty = skuSpecifications.length === 0
  /* if the skuSpecifications array has values, then it should be used to find
   * the variations, which will come ordered the same way they are in the catalog */
  const variationsSource = isSkuSpecificationsEmpty
    ? skuItems
    : skuSpecifications
  const result = useMemo(() => {
    if (
      shouldNotShow ||
      (visibleVariations && visibleVariations.length === 0)
    ) {
      return {}
    }
    let formattedVisibleVariations = visibleVariations
    if (visibleVariations) {
      formattedVisibleVariations = visibleVariations.map(variation =>
        variation.toLowerCase().trim()
      )
    }

    return isSkuSpecificationsEmpty
      ? getVariationsFromItems(
          variationsSource as ProductItem[],
          formattedVisibleVariations
        )
      : getVariationsFromSpecifications(
          variationsSource as SkuSpecification[],
          formattedVisibleVariations
        )
  }, [
    variationsSource,
    shouldNotShow,
    visibleVariations,
    isSkuSpecificationsEmpty,
  ])
  return result
}

interface Props {
  skuItems: ProductItem[]
  skuSelected: ProductItem
  onSKUSelected?: (skuId: string) => void
  maxItems?: number
  visibility?: string
  seeMoreLabel: string
  hideImpossibleCombinations?: boolean
  showValueNameForImageVariation?: boolean
  showValueForVariation?: ShowValueForVariation
  imageHeight?: MaybeResponsiveInput<number>
  imageWidth?: MaybeResponsiveInput<number>
  thumbnailImage?: string
  visibleVariations?: string[]
  showVariationsLabels?: boolean
  variationsSpacing?: number
  showVariationsErrorMessage?: boolean
  initialSelection?: InitialSelectionType
  displayMode?: MaybeResponsiveInput<DisplayMode>
  sliderDisplayThreshold?: number
  sliderArrowSize?: number
  sliderItemsPerPage?: ResponsiveInput<number>
}

const SKUSelectorWrapper: StorefrontFC<Props> = props => {
  const valuesFromContext = useProduct()
  const dispatch = useProductDispatch()
  const { imageHeight, imageWidth } = useResponsiveValues(
    pick(['imageHeight', 'imageWidth'], props)
  )
  const skuItems =
    props.skuItems != null
      ? props.skuItems
      : valuesFromContext?.product?.items ?? []

  const skuSelected =
    props.skuSelected != null
      ? props.skuSelected
      : valuesFromContext.selectedItem

  const visibility = props.visibility != null ? props.visibility : 'always'

  const shouldNotShow =
    skuItems.length === 0 ||
    !skuSelected?.variations ||
    skuSelected.variations.length === 0 ||
    (visibility === 'more-than-one' && skuItems.length === 1)

  const skuSpecifications = valuesFromContext?.product?.skuSpecifications ?? []
  const variations = useVariations(
    skuItems,
    skuSpecifications,
    shouldNotShow,
    props.visibleVariations
  )

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'SKU_SELECTOR_SET_IS_VISIBLE',
        args: { isVisible: !shouldNotShow },
      })
    }
  }, [shouldNotShow, dispatch])

  if (shouldNotShow || !skuSelected) {
    return null
  }

  let showValueForVariation = ShowValueForVariation.none
  if (props.showValueForVariation) {
    showValueForVariation = props.showValueForVariation
  } else if (props.showValueNameForImageVariation) {
    showValueForVariation = ShowValueForVariation.image
  }

  return (
    <SKUSelector
      skuItems={skuItems}
      variations={variations}
      imageWidth={imageWidth}
      skuSelected={skuSelected}
      maxItems={props.maxItems}
      imageHeight={imageHeight}
      displayMode={props.displayMode}
      seeMoreLabel={props.seeMoreLabel}
      onSKUSelected={props.onSKUSelected}
      thumbnailImage={props.thumbnailImage}
      initialSelection={props.initialSelection}
      variationsSpacing={props.variationsSpacing}
      showValueForVariation={showValueForVariation}
      showVariationsLabels={props.showVariationsLabels}
      hideImpossibleCombinations={props.hideImpossibleCombinations}
      showVariationsErrorMessage={props.showVariationsErrorMessage}
      sliderItemsPerPage={props.sliderItemsPerPage}
      sliderArrowSize={props.sliderArrowSize}
      sliderDisplayThreshold={props.sliderDisplayThreshold}
    />
  )
}

SKUSelectorWrapper.schema = {
  title: 'admin/editor.skuSelector.title',
  description: 'admin/editor.skuSelector.description',
}

export default SKUSelectorWrapper
