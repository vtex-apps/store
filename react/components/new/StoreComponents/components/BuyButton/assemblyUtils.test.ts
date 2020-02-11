import {
  transformAssemblyOptions,
  ItemOption,
  InputValuesOption,
} from './assemblyUtils'
import { customBell, comboPizza, starColor } from './__mocks__/assemblyOptions'

test('should transform assemblyOptions', () => {
  const parentPrice = 450
  const parentQuantity = 1

  const resultBell = transformAssemblyOptions(
    customBell.items,
    {},
    parentPrice,
    parentQuantity
  )

  expect(resultBell.options).toHaveLength(5)
  const addonOption = resultBell.options[0] as ItemOption
  expect(addonOption.assemblyId).toBe('add-on_Add-on')
  expect(addonOption.id).toBe('2000588')
  expect(addonOption.quantity).toBe(1)
  expect(addonOption.seller).toBe('1')

  const resultPizza = transformAssemblyOptions(
    comboPizza.items,
    {},
    parentPrice,
    parentQuantity
  )

  expect(resultPizza.options).toHaveLength(2)
  const pizzaOption = resultPizza.options[0] as ItemOption
  expect(pizzaOption.assemblyId).toBe('pizza_composition_Pizza flavor')
  expect(pizzaOption.id).toBe('5101')
  expect(pizzaOption.quantity).toBe(1)
  expect(pizzaOption.seller).toBe('1')
  expect(pizzaOption.options).toHaveLength(3)

  const drinksOptions = resultPizza.options[1] as ItemOption
  expect(drinksOptions.options).toBeUndefined()
})

test('input values', () => {
  const parentPrice = 450
  const parentQuantity = 1

  const resultStar = transformAssemblyOptions(
    starColor.items,
    starColor.inputValues,
    parentPrice,
    parentQuantity
  )

  expect(resultStar.options).toHaveLength(1)
  const customization = resultStar.options[0] as InputValuesOption
  expect(customization.assemblyId).toBe('Customization')
  expect(customization.inputValues).toMatchObject({
    Font: 'Sans serif',
    'Front text': 'Frente',
    'Back text': 'Verso',
    'Glossy print': true,
  })
})

test('empty input values should result in empty options', () => {
  const parentPrice = 450
  const parentQuantity = 1

  const resultStar = transformAssemblyOptions(
    starColor.items,
    {
      Customization: {},
    },
    parentPrice,
    parentQuantity
  )
  expect(resultStar.options.length).toBe(0)
})
