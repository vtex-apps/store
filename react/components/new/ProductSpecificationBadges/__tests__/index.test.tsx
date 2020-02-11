import React from 'react'
import { render } from '@vtex/test-tools/react'
import Index from '../index'

import { getProduct } from '../__mocks__/productMock'

import ProductContextProvider from '../__mocks__/vtex.product-context/ProductContextProvider'


const renderComponent = (customProps: any = {}) => {

  const product = customProps.product || getProduct()

  return render(
    <ProductContextProvider product={product}>
      <Index
        visibleWhen={customProps.visibleWhen}
        specificationsOptions={customProps.specificationsOptions}
        specificationGroupName={customProps.specificationGroupName}
        specificationName={customProps.specificationName}
        displayValue={customProps.displayValue}
      />
    </ProductContextProvider>
  )
}

test('show names inside group that meet condition', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { getByText, queryByText } = renderComponent({
    specificationGroupName: "allSpecifications",
    displayValue: 'SPECIFICATION_NAME',
    visibleWhen: 'True',
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  getByText(/Demo/)
  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})

test('show names inside group that meet conditions array', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]


  const { getByText, queryByText } = renderComponent({
    specificationGroupName: "allSpecifications",
    specificationsOptions: [{
      specificationName: 'On Sale',
      displayValue: 'SPECIFICATION_NAME',
      visibleWhen: 'True',
    }],
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  expect(queryByText(/Demo/)).toBeFalsy()
  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})

test('show badges of generic condition and for specific options', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['Enabled'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['Enabled'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]


  const { getByText, queryByText } = renderComponent({
    specificationGroupName: "allSpecifications",
    displayValue: 'SPECIFICATION_NAME',
    visibleWhen: 'True',
    specificationsOptions: [{
      specificationName: 'Demo',
      displayValue: 'SPECIFICATION_NAME',
      visibleWhen: 'Enabled',
    }],
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  getByText(/Demo/)
  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})

test('test generic condition with specification Name being passed', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]


  const { getByText, queryByText } = renderComponent({
    specificationGroupName: "allSpecifications",
    displayValue: 'SPECIFICATION_NAME',
    visibleWhen: 'True',
    specificationName: 'On Sale',
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  expect(queryByText(/Demo/)).toBeFalsy()
  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})

test('test show demo, value and custom string', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { getByText } = renderComponent({
    // specificationsOptions: {
    //   ['On Sale']: {
    //     displayValue: 'SPECIFICATION_NAME',
    //     visibleWhen: 'True',
    //   },
    //   Demo: {
    //     displayValue: 'SPECIFICATION_VALUE',
    //   },
    //   PromoExclusion: {
    //     displayValue: "Custom String"
    //   }
    // },
    specificationsOptions: [{
      specificationName: 'On Sale',
      displayValue: 'SPECIFICATION_NAME',
      visibleWhen: 'True',
    },
    {
      specificationName: 'Demo',
      displayValue: 'SPECIFICATION_VALUE',
    },
    {
      specificationName: 'PromoExclusion',
      displayValue: 'Custom String',
    }],
    specificationGroupName: "allSpecifications",
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  getByText(/DemoValue/)
  getByText(/Custom String/)
})

test('dont break if wrong group name', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { queryByText } = renderComponent({
    specificationsOptions: [{
      specificationName: 'On Sale',
      displayValue: 'SPECIFICATION_NAME',
      visibleWhen: 'True',
    },
    {
      specificationName: 'Demo',
      displayValue: 'SPECIFICATION_VALUE',
    },
    {
      specificationName: 'PromoExclusion',
      displayValue: 'Custom String',
    }],
    specificationGroupName: "adsaadsad",
    product: getProduct({ specificationGroups }),
  })

  expect(queryByText(/On Sale/)).toBeFalsy()
})

test('dont show item with displayValue condition not provided', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { queryByText, getByText } = renderComponent({
    specificationsOptions: [{
      specificationName: 'On Sale',
      displayValue: 'SPECIFICATION_NAME',
      visibleWhen: 'True',
    },
    {
      specificationName: 'Demo',
    }],
    specificationGroupName: "allSpecifications",
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  expect(queryByText(/Demo/)).toBeFalsy()
})

test('do not break if specificationgroups is undefined', () => {
  const { queryByText } = renderComponent({
    specificationsOptions: [{
      specificationName: 'On Sale',
      displayValue: 'SPECIFICATION_NAME',
      visibleWhen: 'True',
    },
    {
      specificationName: 'Demo',
    }],
    specificationGroupName: "allSpecifications",
    product: getProduct({ specificationGroups: undefined }),
  })

  expect(queryByText(/On Sale/)).toBeFalsy()
})