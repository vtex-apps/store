# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Bye pages.json! Welcome `pages-builder@3.x`.

### Removed
- GTM script and manifest configuration.

## [1.35.3] - 2019-01-14

### Added
- Missing `productReference` field for the ProductContext

## [1.35.2] - 2019-01-14

### Changed
- Remove `description` of the product to search query.

## [1.35.1] - 2018-12-20
### Fixed
- Fix register `DEBUG_SW` query param evaluation.

## [1.35.0] - 2018-12-20
### Added
- Support to messages builder.
- `vtex.admin-pages` as a peer dependency.

## [1.34.2] - 2018-12-20
### Fixed
- Fix location usage (considering SSR).

## [1.34.1] - 2018-12-20
### Added
- Query params to service workers register file request.

## [1.34.0] - 2018-12-13
### Added
- Adding ToastProvider to Store Context.

## [1.33.3] - 2018-12-11
### Fixed
- Content of `meta http-equiv` tag (missing space).

## [1.33.2] - 2018-12-05

## [1.33.1] - 2018-12-05
### Fixed
- Fix canonical path replace to include query parameters.

## [1.33.0] - 2018-12-03

## [1.32.0] - 2018-12-02
### Added
- Support to PWA. 

## [1.31.2] - 2018-12-02

### Changed
- Allow user scaling as recommended by [accessibility guidelines](https://dequeuniversity.com/rules/axe/2.2/meta-viewport)

## [1.31.1] - 2018-12-01
### Added
- Separate extension point for the `request-capture-app`.

## [1.31.0] - 2018-11-30
### Changed
- Uses new runtime feature for prefetching routeIds

## [1.30.0] - 2018-11-27
### Added
- Update updateOrderFormShipping mutation response

## [1.29.0] - 2018-11-16
### Added
- Add optional param to search query to determine if the `facets` should be included.

## [1.28.2] - 2018-11-14
### Changed
- Move the canonical link to the store context, so it's applied to all pages.

## [1.28.1] - 2018-11-13
### Added
- Add the `cacheId` in the search query for the images.

## [1.28.0] - 2018-11-08
### Added
- Extension point for icon packs.

## [1.27.1] - 2018-11-07
### Added
- Meta tag that disables zoom in mobile mode.

## [1.27.0] - 2018-11-06
### Added
- Add field `orderBy` to schema.

## [1.26.2] - 2018-11-06
### Added
- Field `clientProfileData.firstName` in `orderFormQuery`

## [1.26.1] - 2018-11-01
### Added
- Field `clientProfileData.email` in `orderFormQuery`

## [1.26.0] - 2018-10-24

## [1.25.1] - 2018-10-18

### Fixed
- Set absolute url in canonical pages link

## [1.25.0] - 2018-10-16
### Added
- `ExtensionPoint` with an extension container for pixel apps.

## [1.24.0] - 2018-10-16
### Added
- `Pixel` context with store dispatch events.

## [1.23.0] - 2018-10-15
### Changed
- Emit `pageView` event every page change.

## [1.22.0] - 2018-10-11
### Added
- Enables querying of `availableAddresses` in `orderFormQuery`

## [1.21.1] - 2018-10-02
### Added
- `ProductContextProvider`'s query param to the searchPage when product not found.

## [1.21.0] - 2018-10-02
### Added
- Export queries by using an entrypoint
- Sessions query

## [1.20.0] - 2018-10-02

## [1.19.4] - 2018-10-1
### Fixed
- Fix partial product preview.

### Added
- Enables querying of `shippingData` in `orderFormQuery`
- Adds `updateOrderFormShipping`, a mutation and function on `OrderFormContext`

## [1.19.3] - 2018-9-30
### Fixed
- Add `cacheId` and `categories` to `searchQuery` to fix product preview

## [1.19.2] - 2018-09-29
### Changed
- Update `productQuery` to get 10 sku images.

## [1.19.1] - 2018-09-28
### Added
- Add field `values` to the variations property in `productQuery`

## [1.19.0] - 2018-09-27
### Added
- Add custom paramenters to create custom search.

## [1.18.1] - 2018-09-27
### Fixed
- Fix query on brand page with wrong arguments.

## [1.18.0] - 2018-09-25
### Added
- Add prefetch in context providers.

### Changed
- Get account name from runtime context.

## [1.17.2] - 2018-09-24
### Changed
- Add field sku attachments to `productQuery`.

## [1.17.1] - 2018-09-21
### Added
- Add `metaTagRobots` field in store settings.

## [1.17.0] - 2018-09-20
### Added
- `ProductSearchContextProvider` schema to eliminate the `SearchResult` dependency.

## [1.16.0] - 2018-09-18

## [1.15.0] - 2018-09-14
### Added
- `ProductContextProvider` redirect to the searchPage when product not found.

## [1.14.1] - 2018-09-13
### Fixed
- Fix undefined categories prop in `ProductContextProvider`.

### Removed
- Now, `my-orders-app` is embedded in `my-account`, this makes the route `account/orders` useless.

## [1.14.0] - 2018-09-10
### Changed
- Added `priceRange` parameter to search query.

## [1.13.2] - 2018-09-10
### Changed
- Hoist non react statics on data layer hoc.

## [1.13.1] - 2018-08-31
### Fixed
- *HotFix* undefined verification in the `ProductSearchContextProvider`.

### Added
- `benefitSKUIds` property to the benefit data of the `productQuery`.

## [1.13.0] - 2018-08-24
### Changed
- Add more data in `sellers` and `images` in `productQuery`.

## [1.12.4] - 2018-08-23
### Changed
- Update search query to include the `Id` and `Slug` fields in the corresponding types.

## [1.12.3] - 2018-08-23

### Changed
- Add `similars` recommendation data in `productQuery`.

## [1.12.2] - 2018-08-23
### Changed
- Add `recommendations` data in `productQuery`.

## [1.12.1] - 2018-08-22
### Added
- Product not found validation on ProductContextProvider

## [1.12.0] - 2018-08-21
### Added
- Canonical url for search context

## [1.11.2] - 2018-08-20
### Changed
- Update product query to get `productClusters` and `clusterHighlights`

## [1.11.1] - 2018-08-16
### Removed
- Remove `propTypes.js` file.

## [1.11.0] - 2018-08-15
### Added
- Add the updateProfile mutation to the orderFormContext

## [1.10.3] - 2018-08-15
### Fixed
- Prop name conflict in the `ProductSearchContextProvider`.

## [1.10.2] - 2018-08-14
### Added
- Flag on the component inside `ProductSearchContextProvider` regarding which page it is on.

## [1.10.1] - 2018-08-10

## [1.10.0] - 2018-08-10
### Added
- Dispatch `Datalayer` Events (home, category, department, product and search).

### Fixed
- `Microdata` variables to be typed correctly.

## [1.9.6] - 2018-08-10
### Changed
- Change the props passed to the Breadcrumbs

## [1.9.5] - 2018-08-08
### Fixed
- Add a guard in `createMap` when array was 0.

## [1.9.4] - 2018-08-08
### Fixed
- *Hot Fix* Data might be undefined.

## [1.9.3] - 2018-08-08
### Added
- Function to add a new item into the orderForm.

### Fixed
- Mutation of the update orderForm items function.

## [1.9.2] - 2018-08-07
### Fixed
- *Hot Fix* Fix error titleTag of undefined.
## [1.9.1] - 2018-08-07
### Fixed
- Fix object undefined error in dataLayer.

## [1.9.0] - 2018-08-06
### Added
- Add meta tags in ProductContext and SearchContext providers.

## [1.8.0] - 2018-08-06
### Removed
- Unambiguous search paths (`/c, /sc, /s`) don't have suffix anymore.

## [1.7.4] - 2018-08-03
### Fixed
- Init `Data layer` when it doesn't exist.

## [1.7.3] - 2018-08-03
### Added
- Add `PriceRanges` property to `searchQuery`.

## [1.7.2] - 2018-08-03
### Fixed
- `Data Layer` to be recreated after each page change.

## [1.7.1] - 2018-08-02
### Fixed
- Information pushed to the dataLayer on `ProductSearchContextProvider`

## [1.7.0] - 2018-08-01
### Added
- Add `<title>` and `<meta>` in the store. These fields are available on admin settings.

## [1.6.1] - 2018-08-01
### Fixed
- Component `StoreContextProvider` import

## [1.6.0] - 2018-08-01
### Added
- Component `OrderFormContext`

## [1.5.1] - 2018-08-01
### Fixed
- Error destructuring properties of product when before inserting on data layer.

## [1.5.0] - 2018-07-31
### Added
- Product dataLayer to `getData` in `ProductContextProvider`.

## [1.4.6] - 2018-07-31
### Fixed
- Search result filters.

## [1.4.5] - 2018-07-30
### Fixed
- Move `icon.png` to metadata folder.
## [1.4.4] - 2018-07-30
### Changed
- Add more information in product query.

## [1.4.3] - 2018-07-27
### Added
- Add icon and description for the app.

## [1.4.0] - 2018-07-25

### Added
- Provide gtm support

## [1.3.2] - 2018-07-25
### Changed
- Delete all unnecessary path manipulation to not need pages information.

## [1.3.1] - 2018-07-24
### Fixed
- Product search context throwing error on undefined prop.

## [1.3.0] - 2018-07-24
### Changed
- `searchQuery` to retrieve facets and recordsFiltered.

### Removed
- `facetsQuery`.

## [1.2.2] - 2018-07-24
### Fixed
- Data layer component props.

## [1.2.1] - 2018-07-23
### Added
- Stale cache for product

## [1.2.0] - 2018-07-23
### Added
- Data layer integration in the `ProductSearchContextProvider`.
### Fixed
- Fix the `searchHelpers.reversePagesPath` function to return the full path.

## [1.1.3] - 2018-07-18
### Fixed
- Bringing `benefitsProduct` back, after upgrade `app-store` to use `vtex.store@1.x`.

## [1.1.2] - 2018-07-17
### Fixed
- *Hotfix* Remove `benefitsProduct` of productQuery.

## [1.1.1] - 2018-07-17
### Changed
- Change `ProductPage`, passing loading information to the ProductDetails component

## [1.0.2] - 2018-07-16
### Fixed
- Fix params evaluation when there is no page path.

## [1.0.1] - 2018-07-16
### Fixed
- Circular product query

## [0.8.1] - 2018-07-12
### Changed
- Change reverse path evaluation to not use pages.json

### Fixed
- Fix pages params evaluation.

## [0.8.0] - 2018-07-09
- Add auth treament to the route of `/account` and `/account/orders`

## [0.7.1] - 2018-7-9
### Fixed
- Fix path error in non-linked app by adding a default path in case there isn't any.

## [0.7.0] - 2018-7-6
### Changed
- Graphql product query to support benefits retrievement.

## [0.6.1] - 2018-7-6
### Changed
- Add `ExtensionContainer` to `store/login/container`.

## [0.6.0] - 2018-7-6
### Added
- Add the `DepartmentPage` component.

### Fixed
- Fix loading logic inside the `SearchQueryContainer`.

## [0.5.0] - 2018-7-5
### Added
- Add a generic component (`SearchQueryContainer`) to be reused into the different pages that uses search and facets queries.
- Add hints to the end of category and subcategory paths

## [0.4.1] - 2018-7-4
### Fixed
- Display none on microdata.
- Microdata will try to parse multilocale description.

## [0.4.0] - 2018-7-4
### Added
- Add `MicroData` component do `ProductPage`, so Google can have a detailed info on the Products.
- Add the `SearchPage` GraphQL queries.
- Data layer integration in the `ProductPage`.

## [0.4.0-beta] - 2018-7-3
### Changed
- Bump beta version of my-orders.

## [0.3.0] - 2018-6-25
### Added
- Add `pagesPath` prop to the container of `SearchPage` and `CategoryPage`.

### Fixed
- Add `Fragment` in `AccountPage`.

## [0.2.9] - 2018-6-25
### Fixed
- Add route `account/orders` again.

## [0.2.8] - 2018-6-20

### Changed
- Add `categoriesIds` on productQuery.

## [0.2.7] - 2018-6-20
### Changed
- Add `variations` and `properties` on productQuery.

## [0.2.6] - 2018-6-18
### Changed
- Pass props to the extensionPoint of `SearchPage`.
- Modify `store/search` path from `/:term/` to `/:term/s`

## [0.2.5] - 2018-6-14

### Changed
- Update AccountPage to use ExtensionContainer

### Removed
- Remove `my-orders-app`. This app will be included in `dreamstore-theme`.
- Remove route `account/orders`.


## [0.2.4] - 2018-6-14

### Added
- Add `categories` to product query.
- Integrate `vtex.my-orders-app` to store.

## [0.2.3] - 2018-6-11

### Added
- Add `categoryId` to product query.

## [0.2.2] - 2018-6-11

### Added
- Add product prop in _ProductPage_ component.
- Add `linkText`, `brand`, `referenceId` to product query.

## [0.2.0] - 2018-6-5

### Added
- Add categories prop in _ProductPage_ component.
- Add billing policy free on `manifest.json`.

### Fixed
- Removed redundant Spinner in _ProductPage_ component.
