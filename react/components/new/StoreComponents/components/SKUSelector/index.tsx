import React, {
  useState,
  useEffect,
  useMemo,
  memo,
  useCallback,
  FC,
} from 'react'
import { filter, head, isEmpty, compose, keys, length } from 'ramda'
import { useRuntime } from 'vtex.render-runtime'
import {
  useResponsiveValue,
  MaybeResponsiveInput,
  ResponsiveInput,
} from 'vtex.responsive-values'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'

import SKUSelector, { ShowValueForVariation } from './components/SKUSelector'
import {
  parseSku,
  isColor,
  uniqueOptionToSelect,
  findItemWithSelectedVariations,
} from './utils'
import {
  Image,
  ImageMap,
  Variations,
  SelectedVariations,
  SelectorProductItem,
  InitialSelectionType,
  DisplayMode,
} from './types'
import useEffectSkipMount from './components/hooks/useEffectSkipMount'

const keyCount = compose(length, keys)
const filterSelected = filter(Boolean)

const buildEmptySelectedVariation = (variations: Variations) => {
  const variationNames = Object.keys(variations)
  const result = {} as Record<string, null>
  for (const variationName of variationNames) {
    result[variationName] = null
  }
  return result
}

/** receives an item and the variations object, returns the selected variations for that item */
const selectedVariationFromItem = (
  item: SelectorProductItem,
  variations: Variations
) => {
  const variationNames = Object.keys(variations)
  const result = {} as Record<string, string>
  for (const variationName of variationNames) {
    result[variationName] = item.variationValues[variationName]
  }
  return result
}

function useColorImages(items: SelectorProductItem[], imageRegexText: string) {
  const imageRegex = new RegExp(imageRegexText, 'i')

  return items.map(item => {
    if (!item.images) {
      return item
    }

    const hasVariationImage = item.images.some(
      image => image.imageLabel && imageRegex.test(image.imageLabel)
    )
    return {
      ...item,
      images: item.images.filter(image => {
        if (!image.imageLabel) {
          // if it doesn't have a variation image, it wont remove images without a label
          return !hasVariationImage
        }
        return imageRegex.test(image.imageLabel)
      }),
    }
  })
}

const useImagesMap = (
  items: SelectorProductItem[],
  variations: Variations,
  thumbnailImage?: string
) => {
  return useMemo(() => {
    if (thumbnailImage) {
      items = useColorImages(items, thumbnailImage)
    }

    const variationNames = Object.keys(variations)
    const result: ImageMap = {}
    for (const variationName of variationNames) {
      // Today, only "Color" variation should show image, need to find a more resilient way to tell this, waiting for backend
      if (!isColor(variationName)) {
        continue
      }
      const imageMap = {} as Record<string, Image | undefined>
      const variationValues = variations[variationName]
      for (const variationValue of variationValues) {
        const item = items.find(
          sku => sku.variationValues[variationName] === variationValue
        )
        imageMap[variationValue] = item && head(item.images)
      }
      result[variationName] = imageMap
    }
    return result
  }, [items, variations])
}

const useAllSelectedEvent = (
  selectedVariations: SelectedVariations | null,
  variationsCount: number
) => {
  const dispatch = useProductDispatch()
  useEffect(() => {
    if (dispatch && selectedVariations) {
      const selectedNotNull = filterSelected(selectedVariations)
      const selectedCount = keyCount(selectedNotNull)
      const allSelected = selectedCount === variationsCount
      dispatch({
        type: 'SKU_SELECTOR_SET_VARIATIONS_SELECTED',
        args: { allSelected },
      })
    }
  }, [dispatch, selectedVariations, variationsCount])
}

interface Props {
  skuItems: ProductItem[]
  onSKUSelected?: (skuId: string) => void
  seeMoreLabel: string
  maxItems?: number
  variations: Variations
  skuSelected: ProductItem
  hideImpossibleCombinations?: boolean
  showValueForVariation?: ShowValueForVariation
  imageHeight?: number
  imageWidth?: number
  thumbnailImage?: string
  showVariationsLabels?: boolean
  variationsSpacing?: number
  showVariationsErrorMessage?: boolean
  initialSelection?: InitialSelectionType
  displayMode?: MaybeResponsiveInput<DisplayMode>
  sliderDisplayThreshold?: number
  sliderArrowSize?: number
  sliderItemsPerPage?: ResponsiveInput<number>
}

const getNewSelectedVariations = (
  query: any,
  skuSelected: ProductItem,
  variations: Variations,
  initialSelection?: InitialSelectionType
) => {
  const hasSkuInQuery = Boolean(query?.skuId)
  const parsedSku = parseSku(skuSelected)
  const emptyVariations = buildEmptySelectedVariation(variations)

  if (hasSkuInQuery || initialSelection === InitialSelectionType.complete) {
    return selectedVariationFromItem(parsedSku, variations)
  } else if (initialSelection === InitialSelectionType.image) {
    const colorVariationName = parsedSku.variations.find(isColor)
    return {
      ...emptyVariations,
      ...(colorVariationName
        ? {
            [colorVariationName]: parsedSku.variationValues[colorVariationName],
          }
        : {}),
    }
  }

  return emptyVariations
}

/**
 * Display a list of SKU items of a product and its specifications.
 */
const SKUSelectorContainer: FC<Props> = ({
  skuItems = [],
  onSKUSelected,
  seeMoreLabel,
  maxItems = 10,
  variations,
  skuSelected,
  imageWidth,
  imageHeight,
  thumbnailImage,
  variationsSpacing,
  showVariationsLabels = true,
  displayMode = DisplayMode.default,
  hideImpossibleCombinations = true,
  showVariationsErrorMessage = true,
  showValueForVariation = ShowValueForVariation.none,
  initialSelection = InitialSelectionType.complete,
  sliderDisplayThreshold = 3,
  sliderArrowSize = 12,
  sliderItemsPerPage = {
    desktop: 3,
    tablet: 2,
    phone: 1,
  },
}) => {
  const variationsCount = keyCount(variations)
  const { query } = useRuntime()
  const responsiveDisplayMode = useResponsiveValue(displayMode)

  const parsedItems = useMemo(() => skuItems.map(parseSku), [skuItems])
  const { setQuery } = useRuntime()
  const redirectToSku = (skuId: string) => {
    setQuery(
      { skuId },
      {
        replace: true,
      }
    )
  }

  const [selectedVariations, setSelectedVariations] = useState<
    SelectedVariations
  >(() =>
    getNewSelectedVariations(query, skuSelected, variations, initialSelection)
  )
  useAllSelectedEvent(selectedVariations, variationsCount)

  useEffectSkipMount(() => {
    setSelectedVariations(
      getNewSelectedVariations(query, skuSelected, variations, initialSelection)
    )
  }, [variations])

  // No need to add skuSelected and onSKUSelected to dependency array since that would result in infinite loops
  useEffect(() => {
    if (skuSelected && onSKUSelected) {
      onSKUSelected(skuSelected.itemId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skuSelected.itemId])

  const imagesMap = useImagesMap(parsedItems, variations, thumbnailImage)

  const onSelectItem = useCallback(
    ({
      name: variationName,
      value: variationValue,
      skuId,
      isMainAndImpossible,
      possibleItems,
    }) => {
      const isRemoving = selectedVariations![variationName] === variationValue
      const newSelectedVariation = !isMainAndImpossible
        ? {
            ...selectedVariations,
            [variationName]: isRemoving ? null : variationValue,
          }
        : {
            ...buildEmptySelectedVariation(variations),
            [variationName]: variationValue,
          }
      // Set here for a better response to user
      setSelectedVariations(newSelectedVariation)
      const uniqueOptions = isRemoving
        ? {}
        : uniqueOptionToSelect(
            possibleItems,
            newSelectedVariation,
            isMainAndImpossible
          )
      const finalSelected = {
        ...newSelectedVariation,
        ...uniqueOptions,
      }
      if (!isEmpty(uniqueOptions)) {
        setSelectedVariations(finalSelected)
      }

      const selectedNotNull = filterSelected(finalSelected)
      const selectedCount = keyCount(selectedNotNull)
      const allSelected = selectedCount === variationsCount
      let skuIdToRedirect = skuId
      if (!skuIdToRedirect || !isEmpty(uniqueOptions)) {
        const newItem = findItemWithSelectedVariations(
          possibleItems,
          finalSelected
        )
        skuIdToRedirect = newItem!.itemId
      }

      if (isRemoving) {
        // If its just removing, no need to do anything.
        return
      }

      if (onSKUSelected) {
        onSKUSelected(skuIdToRedirect)
      } else {
        if (allSelected || isColor(variationName)) {
          redirectToSku(skuIdToRedirect)
        }
      }
    },
    // Adding selectedVariations, variationsCount and onSKUSelected causes an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedVariations, variations, onSKUSelected]
  )

  return (
    <SKUSelector
      maxItems={maxItems}
      imagesMap={imagesMap}
      skuItems={parsedItems}
      variations={variations}
      imageWidth={imageWidth}
      displayMode={responsiveDisplayMode}
      imageHeight={imageHeight}
      seeMoreLabel={seeMoreLabel}
      onSelectItem={onSelectItem}
      variationsSpacing={variationsSpacing}
      selectedVariations={selectedVariations}
      showVariationsLabels={showVariationsLabels}
      showValueForVariation={showValueForVariation}
      hideImpossibleCombinations={hideImpossibleCombinations}
      showVariationsErrorMessage={showVariationsErrorMessage}
      sliderDisplayThreshold={sliderDisplayThreshold}
      sliderArrowSize={sliderArrowSize}
      sliderItemsPerPage={sliderItemsPerPage}
    />
  )
}

export default memo(SKUSelectorContainer)
