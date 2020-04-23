import {
  getDepartmentMetadata,
  getCategoryMetadata,
  getSearchMetadata,
} from './searchMetadata'

test('should get department metadata', () => {
  const searchQuery = {
    facets: {
      categoriesTrees: [
        {
          id: '1',
          name: 'foo',
          selected: true,
          children: [
            {
              id: '2',
              name: 'bar',
              selected: false,
              children: [],
            },
          ],
        },
      ],
    },
  }

  const result = getDepartmentMetadata(searchQuery)

  expect(result!.id).toBe('1')
  expect(result!.name).toBe('foo')
})

test('should get category metadata', () => {
  const searchQuery = {
    facets: {
      categoriesTrees: [
        {
          id: '1',
          name: 'foo',
          selected: true,
          children: [
            {
              id: '2',
              name: 'bar',
              selected: true,
              children: [],
            },
          ],
        },
      ],
    },
  }

  const result = getCategoryMetadata(searchQuery)

  expect(result!.id).toBe('2')
  expect(result!.name).toBe('bar')
})

test('should not get category metadata if none is selected', () => {
  const searchQuery = {
    facets: {
      categoriesTrees: [
        {
          id: '1',
          name: 'foo',
          selected: true,
          children: [
            {
              id: '2',
              name: 'bar',
              selected: false,
              children: [],
            },
          ],
        },
      ],
    },
  }

  const result = getCategoryMetadata(searchQuery)

  expect(result).toBeUndefined()
})

test('should get deepest category metadata', () => {
  const searchQuery = {
    facets: {
      categoriesTrees: [
        {
          id: '1',
          name: 'foo',
          selected: true,
          children: [
            {
              id: '2',
              name: 'bar',
              selected: true,
              children: [
                {
                  id: '3',
                  name: 'baz',
                  selected: true,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  }

  const result = getCategoryMetadata(searchQuery)

  expect(result!.id).toBe('3')
  expect(result!.name).toBe('baz')
})

test('should get the searched metadata', () => {
  const searchQuery = {
    productSearch: {
      recordsFiltered: 3,
      breadcrumb: [
        {
          name: 'Top',
          href: '/electronics/top?map=c,ft',
        },
      ],
    },
    facets: {
      categoriesTrees: [
        {
          id: '1',
          name: 'foo',
          selected: true,
          children: [],
        },
      ],
    },
  }

  const result = getSearchMetadata(searchQuery)

  expect(result!.term).toBe('Top')
  expect(result!.category!.id).toBe('1')
  expect(result!.category!.name).toBe('foo')
  expect(result!.results).toBe(3)
})

test('should get the searched metadata without category', () => {
  const searchQuery = {
    productSearch: {
      recordsFiltered: 3,
      breadcrumb: [
        {
          name: 'Top',
          href: '/electronics/top?map=c,ft',
        },
      ],
    },
    facets: {
      categoriesTrees: [
        {
          id: '1',
          name: 'foo',
          selected: false,
          children: [],
        },
      ],
    },
  }

  const result = getSearchMetadata(searchQuery)

  expect(result!.term).toBe('Top')
  expect(result!.category).toBeNull()
  expect(result!.results).toBe(3)
})
