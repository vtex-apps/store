import React from 'react'
import { render } from '@vtex/test-tools/react'
import ProductImages from './../../ProductImages'
import useProduct from 'vtex.product-context/useProduct'
import { createItem } from '../../__mocks__/productMock'

const mockUseProduct = useProduct

jest.mock('react-id-swiper/lib/ReactIdSwiper', () => {
  return {
    default: ({ children }) => {
      return <div>{children}</div>
    },
  }
})

jest.mock('swiper/dist/js/swiper.esm', () => {
  return {
    Pagination: 'Pagination',
    Navigation: 'Navigation',
  }
})

// This Image mock only call set onload function after user sets the src property in object
class FakeImage {
  onload = null
  set src(newSrc) {
    this.onload && this.onload()
  }
}

beforeEach(() => {
  window.Image = FakeImage
})

describe('<ProductImages />', () => {
  const renderComponent = customProps => {
    return render(<ProductImages {...customProps} />)
  }

  it('should render two images (thumb and main image) for each product image', () => {
    const props = {
      images: [
        {
          imageUrls: ['url'],
          thresholds: [1],
          thumbnailUrl: 'url',
          imageText: 'imageText',
        },
        {
          imageUrls: ['url2'],
          thresholds: [1],
          thumbnailUrl: 'url2',
          imageText: 'imageText2',
        },
      ],
    }
    const { getAllByAltText } = renderComponent(props)
    expect(getAllByAltText('imageText').length).toBe(2)
    expect(getAllByAltText('imageText2').length).toBe(2)
  })
  it('should show thumbs when there is more than one image', () => {
    const props = {
      images: [
        {
          imageUrls: ['url'],
          thresholds: [1],
          thumbnailUrl: 'url',
          imageText: 'imageText',
        },
        {
          imageUrls: ['url2'],
          thresholds: [1],
          thumbnailUrl: 'url2',
          imageText: 'imageText2',
        },
      ],
    }
    const { queryByTestId, getAllByAltText } = renderComponent(props)
    const swiper = queryByTestId('thumbnail-swiper')
    expect(swiper.className.includes('db-ns')).toBeTruthy()
    getAllByAltText('imageText')
    getAllByAltText('imageText2')
  })
  it('should NOT show thumbs when there is one image', () => {
    const props = {
      images: [
        {
          imageUrls: ['url'],
          thresholds: [1],
          thumbnailUrl: 'url',
          imageText: 'imageText',
        },
      ],
    }
    const { queryByTestId } = renderComponent(props)

    const swiper = queryByTestId('thumbnail-swiper')
    expect(swiper).toBe(null)
  })

  describe('test logic to thumbnail orientation', () => {
    it('should render with correct classes when vertical', () => {
      const props = {
        thumbnailsOrientation: 'vertical',
        images: [
          {
            imageUrls: ['url'],
            thresholds: [1],
            thumbnailUrl: 'url',
            imageText: 'imageText',
          },
          {
            imageUrls: ['url2'],
            thresholds: [1],
            thumbnailUrl: 'url2',
            imageText: 'imageText2',
          },
        ],
      }
      const { queryByTestId } = renderComponent(props)

      const swiper = queryByTestId('thumbnail-swiper')
      expect(swiper.className.includes('absolute')).toBeTruthy()
      expect(swiper.className.includes('w-20')).toBeTruthy()
    })
    it('default orientation should be vertical', () => {
      const props = {
        images: [
          {
            imageUrls: ['url'],
            thresholds: [1],
            thumbnailUrl: 'url',
            imageText: 'imageText',
          },
          {
            imageUrls: ['url2'],
            thresholds: [1],
            thumbnailUrl: 'url2',
            imageText: 'imageText2',
          },
        ],
      }
      const { queryByTestId } = renderComponent(props)

      const swiper = queryByTestId('thumbnail-swiper')
      expect(swiper.className.includes('absolute')).toBeTruthy()
      expect(swiper.className.includes('w-20')).toBeTruthy()
    })
    it('should render with correct classes when horizontal', () => {
      const props = {
        thumbnailsOrientation: 'horizontal',
        images: [
          {
            imageUrls: ['url'],
            thresholds: [1],
            thumbnailUrl: 'url',
            imageText: 'imageText',
          },
          {
            imageUrls: ['url2'],
            thresholds: [1],
            thumbnailUrl: 'url2',
            imageText: 'imageText2',
          },
        ],
      }
      const { queryByTestId } = renderComponent(props)

      const swiper = queryByTestId('thumbnail-swiper')
      expect(swiper.className.includes('absolute')).toBeFalsy()
      expect(swiper.className.includes('w-20')).toBeFalsy()
    })
    it('should render with correct classes when vertical and position left', () => {
      const props = {
        thumbnailsOrientation: 'vertical',
        position: 'left',
        images: [
          {
            imageUrls: ['url'],
            thresholds: [1],
            thumbnailUrl: 'url',
            imageText: 'imageText',
          },
          {
            imageUrls: ['url2'],
            thresholds: [1],
            thumbnailUrl: 'url2',
            imageText: 'imageText2',
          },
        ],
      }
      const { queryByTestId } = renderComponent(props)

      const swiper = queryByTestId('thumbnail-swiper')
      expect(swiper.className.includes('absolute')).toBeTruthy()
      expect(swiper.className.includes('w-20')).toBeTruthy()
      expect(swiper.className.includes('left')).toBeTruthy()
      expect(swiper.className.includes('right')).toBeFalsy()
    })
    it('should render with correct classes when vertical and position right', () => {
      const props = {
        thumbnailsOrientation: 'vertical',
        position: 'right',
        images: [
          {
            imageUrls: ['url'],
            thresholds: [1],
            thumbnailUrl: 'url',
            imageText: 'imageText',
          },
          {
            imageUrls: ['url2'],
            thresholds: [1],
            thumbnailUrl: 'url2',
            imageText: 'imageText2',
          },
        ],
      }
      const { queryByTestId } = renderComponent(props)

      const swiper = queryByTestId('thumbnail-swiper')
      expect(swiper.className.includes('absolute')).toBeTruthy()
      expect(swiper.className.includes('w-20')).toBeTruthy()
      expect(swiper.className.includes('left')).toBeFalsy()
      expect(swiper.className.includes('right')).toBeTruthy()
    })
  })

  describe('test with product context', () => {
    it('render properly with product in context', () => {
      mockUseProduct.mockImplementation(() => ({
        selectedItem: createItem({}),
      }))
      const { queryAllByAltText } = renderComponent({})
      expect(queryAllByAltText('imageText').length).toBe(2)
      expect(queryAllByAltText('imageText2').length).toBe(2)
      expect(queryAllByAltText('imageText3').length).toBe(2)
    })
    it('give priority to prop items if product in context', () => {
      mockUseProduct.mockImplementation(() => ({
        selectedItem: createItem({}),
      }))
      const props = {
        images: [
          {
            imageUrls: ['url'],
            thresholds: [1],
            thumbnailUrl: 'url',
            imageText: 'propImageText',
          },
          {
            imageUrls: ['url2'],
            thresholds: [1],
            thumbnailUrl: 'url2',
            imageText: 'propImageText2',
          },
        ],
      }
      const { queryAllByAltText } = renderComponent(props)
      expect(queryAllByAltText('propImageText').length).toBe(2)
      expect(queryAllByAltText('propImageText2').length).toBe(2)
    })
  })
})
