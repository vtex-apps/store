# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- `setCheckoutCookie` argument to control whether or not `vtex.checkout-graphql` not set the `'checkout.vtex.com'` cookie.

## [2.93.0] - 2020-03-24
### Added
- `enableOrderFormOptimization` setting.

## [2.92.0] - 2020-03-20

## [2.91.0] - 2020-03-18
### Added
- Support for `__fold__.experimentalLazyAssets`.

## [2.90.2] - 2020-03-09
### Changed
- Adds `vtex.store-indexer` to dependencies

## [2.90.1] - 2020-03-05
### Changed
- NetworkStatusToast is now dismissable.
- Slight performance improvements on NetworkStatusToast.

### Fixed
- Issue where the NetworkStatusToast wouldn't disappear when the connection came back online.

## [2.90.0] - 2020-03-03

## [2.89.1] - 2020-03-02
### Added
- Add a navigation normalization option to disable lowercase

## [2.89.0] - 2020-02-28
### Added
- New settings `searchTermPath`

## [2.88.1] - 2020-02-27
### Fixed
- Correctly display favicons for relative images in stores with rootpath.

## [2.88.0] - 2020-02-20
### Added
- Support for `__fold__.experimentalLazyImages` block.

## [2.87.5] - 2020-02-19
### Fixed
- Add back dependencies that could cause problems in themes that were published prior to December 3rd.

## [2.87.4] - 2020-02-19
### Removed
- Dependencies that became unnecessary.

## [2.87.3] - 2020-02-18
### Changed
- Import queries and mutations directly.

## [2.87.2] - 2020-02-11 [YANKED]
### Changed
- `vtex.order-placed` dependency to `vtex.oder-placed-1-x-copy`.

## [2.87.1] - 2020-02-07
### Fixed
- Release removing code that cause deprecation

## [2.87.0] - 2020-02-06
### Added
- Separate URL normalization on navigate for new and legacy search URLs

## [2.86.0] - 2020-02-06 [YANKED]
### Added
- Adds fallbackEntities to product route

## [2.85.5] - 2020-02-03 [YANKED]
### Removed
- Dependencies that became unnecessary.

## [2.85.4] - 2020-01-30
### Fixed
- Adds contentType to product not found route

## [2.85.3] - 2020-01-28
### Fixed
- Adds `/*terms` to subcategory canonical

## [2.85.2] - 2020-01-28
### Changed
- Ordination value of "Relevance" from empty string to `OrderByScoreDESC`.

## [2.85.1] - 2020-01-27
### Added
- `store.not-found` and `store.not-found#product`.

## [2.85.0] - 2020-01-24
### Added
- `simulationBehavior` prop to SearchContext.

## [2.84.0] - 2020-01-23
### Added
- Allow `product-bookmark` in Product Page.

## [2.83.0] - 2020-01-21
### Added
- New pixel event `userData`.

## [2.82.0] - 2020-01-20
### Added
- `OrderItemsProvider` in `StoreWrapper`.

## [2.81.0] - 2020-01-13
### Added
- Allow `iframe` on any page.

## [2.80.0] - 2020-01-02
### Added
- `facetsBehavior` on the `SearchContext`.

## [2.79.2] - 2019-12-20
### Changed
- ProductContext loading prop is only set true while the main product query is not done.

## [2.79.1] - 2019-12-16
### Fixed
- Issues with IE11.

## [2.79.0] - 2019-12-12
### Added
- Navigation normalisation with path.toLowerCase and sort of specificationFilters

## [2.78.1] - 2019-12-11
### Added
- Pass down `facetsLoading` variable in SearchContext.

## [2.78.0] - 2019-12-05
### Added
- `search-result-layout` as allowed to `store.custom`

## [2.77.1] - 2019-12-04
### Fixed
- Hanging loading screen between search pages.

## [2.77.0] - 2019-12-03
### Removed
The following changes does not consist in a breaking change since those events are not part of the public API:

- Params removed from `emptySearchView`, `categoryView`, `departmentView`, `productView`, and `internalSiteSearchView` events:
  - `pageCategory`
  - `pageDepartment`
  - `pageFacets`
- Params removed from `productView` event:
  - `productBrandName`
  - `productCategoryId`
  - `productCategoryName`
  - `productDepartmentId`
  - `productDepartmentName`
  - `productId`
  - `productName`
  - `productListPriceFrom`
  - `productListPriceTo`
  - `productPriceFrom`
  - `productPriceTo`
  - `sellerId`
  - `sellerIds`
  - `productReferenceId`
  - `productEans`
  - `skuStockOutFromProductDetail`
  - `skuStockOutFromShelf`

### Added
- Params added to `emptySearchView`, `categoryView`, `departmentView`, and `internalSiteSearchView` events:
  - `category`
  - `department`

### Changed
- `productView` event now only passes the required data.

## [2.76.1] - 2019-11-21

### Removed
- `customWrapper` from `interfaces.json`

## [2.76.0] - 2019-11-21
### Added
- `add-to-cart` button to allowed list for `store.product`.

## [2.75.1] - 2019-11-19
### Changed
- Update to only add the register service worker script if the browser supports
  it. This also changes to only add this script in the client-side.

## [2.75.0] - 2019-11-13
### Added	
- New contexts from vtex.order-manager to the StoreWrapper component

## [2.74.1] - 2019-11-13
### Changed
- Renamed offline page route to `/_v/offline`.

## [2.74.0] - 2019-11-11 [YANKED]
### Added	
- New contexts from vtex.order-manager to the StoreWrapper component

## [2.73.0] - 2019-11-11
### Added
- `menu` to allowed list for `store` interface.

## [2.72.0] - 2019-11-08
### Added
- Support for `skusFilter` variable in SearchContext.

## [2.71.0] - 2019-11-07
### Added
- LoadingContext to Product and Search wrappers.

## [2.70.2] - 2019-10-29
### Added
- Support for queries with `preventRouteChange`.

## [2.70.1] - 2019-10-29
### Fixed
- Revert remove prefetch default pages

## [2.70.0] - 2019-10-29
### Added
- `list-context` to allowed list.

## [2.69.0] - 2019-10-24
### Added
- Add `/offline` route with `offline-warning` block.

## [2.68.1] - 2019-10-22
### Fixed
- Move code to vtex.structured-data.

## [2.68.0] - 2019-10-17
### Added
- `iframe` to allowed list on `store.custom`

## [2.67.0] - 2019-10-15
### Added
- `responsive-layout` to allowed lists.

## [2.66.1] - 2019-10-15
### Fixed
- Prevent crash on product page when product had empty category tree.

## [2.66.0] - 2019-10-15
### Added
- `image-slider` block from `vtex.store-image` as allowed.

## [2.65.0] - 2019-10-14

## [2.64.0] - 2019-10-08
### Added
- `stack-layout` and `product-specification-badges` to allowed lists.

## [2.63.0] - 2019-09-30
### Added
- Make `pickup-availability`be available for use in `store.product`.

## [2.62.1] - 2019-09-26

## [2.62.1-beta] - 2019-09-26

### Changed
- Remove prefetch of pages to test impact on load time

## [2.62.0] - 2019-09-24

## [2.61.1] - 2019-09-23
### Fixed
- Structured data not filtering out of stock sellers correctly.

## [2.61.0] - 2019-09-23
### Added
- `slider-layout` block from `vtex.slider-layout` as allowed.

## [2.60.3] - 2019-09-20
### Added
- `tab-layout`, `tab-content`, and `tab-list` blocks from `vtex.tab-layout`

## [2.60.2] - 2019-09-20

## [2.60.1] - 2019-09-20
### Fixed
- Cleanup unused dependency.

## [2.60.0] - 2019-09-19

## [2.59.0] - 2019-09-17
### Added
- `__fold__` blocks, along with `mobile` and `desktop` variants, to be able to set what lies "below the fold".

## [2.58.2] - 2019-09-16

## [2.58.1] - 2019-09-16
### Removed
- `amphtml` helmet link.

## [2.58.0] - 2019-09-13
### Added
- Link with `rel=amphtml` linking to AMP page.

### Fixed
- Meta tags with empty content.

## [2.57.0] - 2019-09-11

## [2.56.1] - 2019-09-10

## [2.56.1] - 2019-09-10
- Removes call to `useNotFound` for hotfix 

## [2.56.0] - 2019-09-10

## [2.55.2] - 2019-09-10

### Changed

- Revert the following change:
> - Meta tag `robots` from manifest and `StoreWrapper`.

## [2.55.1] - 2019-09-10
### Changed
- Start using `search-graphql`.

## [2.55.0] - 2019-09-10
### Added
- Allow usage of flexible search result blocks.

## [2.54.1] - 2019-09-09

### Removed

- Meta tag `keywords` from manifest and components that still used it.
- Meta tag `robots` from manifest and `StoreWrapper`.

## [2.54.0] - 2019-09-09
### Changed
- Trigger `productView` when selected SKU changes.

## [2.53.7] - 2019-09-04
### Fixed
- Uses `metaTagDescription` instead of `description` on product structured data, which fixes an issue where scripts added to the description would break the page.

## [2.53.6] - 2019-09-02
### Fixed
- Get search metadata from correct place.

## [2.53.5] - 2019-09-02
### Added
- Add structured-data dependency.
- Add SearchAction component in StoreWrapper.

## [2.53.4] - 2019-09-02
### Changed
- Do SearchMetadata with SSR to get title and metadescription.

## [2.53.3] - 2019-08-30
### Added
- Made `blog-breadcrumb` an allowed block on blog pages.

## [2.53.2] - 2019-08-30
### Fixed
- Move Helmet of StoreWrapper to a level where it does not override the children titles.

## [2.53.1] - 2019-08-29
### Changed
- Use product category tree query on client side.

## [2.53.0] - 2019-08-28
### Changed
- PWA helmet and query in `StoreWrapper` and move it to `PWAProvider`.

## [2.52.3] - 2019-08-27
### Fixed
- Fallback to empty query string in StoreWrapper.
- Stop using spread operator in null or false (IE11 fix).

## [2.52.2] - 2019-08-27

## [2.52.1] - 2019-08-26
### Fixed
- Redirect of empty product to `store.search` page.

## [2.52.0] - 2019-08-23

## [2.51.0] - 2019-08-23
### Added
- Prefetch `store.search` and `store.custom` pages

## [2.50.1] - 2019-08-21
### Fixed
- Bug when filtering in a department page

## [2.50.0] - 2019-08-21
### Removed
- Removes the catch all route in favor of using rewriter

## [2.49.0] - 2019-08-14
### Added
- ContentType to routes

## [2.48.0] - 2019-08-01
### Added
- Allow `product-teaser.product`.

## [2.47.2] - 2019-07-31
### Fixed
- Wrong information being passed at StructuredData
- Send pageView event on  ProductPage at the correct moments.

### Changed
- Create and use ProductTitle at ProductWrapper

## [2.47.1] - 2019-07-30
### Fixed
- The default order by option is now `relevance`

## [2.47.0] - 2019-07-30
### Changed
- Uses store name as suffix on Product and Search context pages instead of title tag.

## [2.46.1] - 2019-07-29
### Removed
- ProductContext stray props being passed down, `props` and `breacrumbProps`.

## [2.46.0] - 2019-07-26
### Added
- `product-assembly-options` to allowed component list of `store.product`.
- `assemblyOptions` variable to ProductPage reducer state.

## [2.45.0] - 2019-07-24

### Added
- Support for root path (e.g. a site served under /ar) to canonical routes and to login challenge.

## [2.44.0] - 2019-07-24

### Added
- `store.content` to interfaces

## [2.43.1] - 2019-07-19
### Fixed
- Fix issue where product pages when open through CSR wouldn't display product variations.

## [2.43.0] - 2019-07-17
### Added
- Add `store.blog-home`, `store.blog-category`, `store.blog-post`, `store.blog-search-result` pages.

## [2.42.1] - 2019-07-15

## [2.42.0] - 2019-07-11
### Added
- Allow `search-result` to `store.custom`.

## [2.41.0] - 2019-07-10
### Added
- Add `sticky-layout` to allowed interfaces of `store`.

## [2.40.0] - 2019-07-08
### Added
- `/:slug/p` as product canonical page

## [2.39.0] - 2019-07-03
### Added
- `product-identifier` as allowed in product page.

## [2.38.0] - 2019-07-03
### Changed
- Require `header.full` instead of `header` on every store page.

## [2.37.0] - 2019-07-02
### Added
- `id` to product query in `ProductContext`

## [2.36.0] - 2019-07-02
### Added
- Adds optional parameters to routes

## [2.35.2] - 2019-07-02
### Fixed
- Fixed issues with navigation. Reverted changes made in 2.34.0, as they were causing the issue.

## [2.35.1] - 2019-07-01

### Changed
- Remove `disableSSR` option from settings schema.

## [2.35.0] - 2019-07-01
### Changed
- Makes wrappers have a min-height of 100vh, allowing aligning the footer to the bottom of the screen.

## [2.34.0] - 2019-07-01
### Changed
- Adds optional id to routes with translatable terms

## [2.33.6] - 2019-06-28

### Changed
- Improve product page title.

## [2.33.5] - 2019-06-27
### Fixed
- Issue when switching from products withou exiting product page.

## [2.33.4] - 2019-06-27

### Fixed
- Build assets with new builder hub.

## [2.33.3] - 2019-06-26
### Fixed
- Problem when switching SKUs in flexible product page.

## [2.33.2] - 2019-06-26
### Fixed

- Problem when entering product page from home.

## [2.33.1] - 2019-06-26

### Removed

- Removed ProductContextProvider from ProductContext and left only on ProductWrapper.

### Added

- Reducer and state to be changed by children components of product page.

## [2.33.0] - 2019-06-24

### Added

- Allow `product-brand` block on `store.product` page.

## [2.32.3] - 2019-06-21

### Changed

- `SearchContext` use `SearchQuery` component from `search-result`.

## [2.32.2] - 2019-06-18

### Fixed

- Show `filter-navigator` on brand/product cluster pages.

## [2.32.1] - 2019-06-17

### Fixed

- PropType of `hideUnavailableItems` in `SearchContext`.

## [2.32.0] - 2019-06-17

### Added

- Open Graph protocol to product page.

## [2.31.1] - 2019-06-14

### Fixed

- Make `getLocation()` of `ProfileChallenge` works on SSR.

## [2.31.0] - 2019-06-13

### Added

- `requiresAuthorization` setting, in order to support B2B stores behaviour.

## [2.30.2] - 2019-06-12

### Fixed

- Add robots meta tag with "noindex,follow" when it's a search result.

## [2.30.1] - 2019-06-12

### Fixed

- Show the heart icon of wish list in product details.

## [2.30.0] - 2019-06-10

### Added

- Support for shop-review-interfaces block in store.orderplaced (block also needed to be allowed in order-placed app)

## [2.29.1] - 2019-06-10

## [2.29.1-beta] - 2019-06-10

### Fixed

- Root path not prepended to PWA-related routes.

## [2.29.0] - 2019-06-06

## [2.29.0-beta] - 2019-06-06

### Added

- Service worker as default in the store.

## [2.28.1] - 2019-06-05

### Fixed

- Multiple manifest being added to the page `head`.

## [2.28.0] - 2019-06-04

### Added

- Add `product-context` dependency
- Allow blocks in `product-details` to be applied directly to `store.product`

## [2.27.0] - 2019-05-28

### Changed

- Move PWA query to be execute on CSR.

## [2.26.0] - 2019-05-27

### Changed

- Pixel architecture.

## [2.25.1] - 2019-05-27

### Fixed

- Add `defer` attribute to the `/pwa/workers/register.js` script tag.

## [2.25.0] - 2019-05-25

### Added

- Add "image" block to store.

## [2.24.1] - 2019-05-24

### Changed

- Stop doing the recAndBenefits query at ProductContext. Only fetch benefits now.

## [2.24.0] - 2019-05-24

### Added

- Add custom title and metatags for routes declaring it.

## [2.23.2] - 2019-05-23

### Fixed

- Referrer when is the same origin.

## [2.23.1] - 2019-05-23

### Added

- Add support for `sandbox`.

## [2.23.0] - 2019-05-22

### Added

- `referrer` to `pageView` event.

## [2.22.7] - 2019-05-20

### Fixed

- Add logic to clean dirty params passed to SearchContext.

## [2.22.6] - 2019-05-20

### Fixed

- Reactivate `hideUnavailableItems`prop os SearchContext.

## [2.22.5] - 2019-05-16

### Changed

- Remove canonical discovery and history replacement code.

## [2.22.4] - 2019-05-15

### Fixed

- `NetworkStatusToast` need to be dismissable on mobile devices.

## [2.22.3] - 2019-05-15

### Added

- New `map` field on routes to better support legacy URLs.

## [2.22.2] - 2019-05-13

### Changed

- Add `selectedSku` in productView event.

## [2.22.1] - 2019-05-13

### Changed

- General settings labels and descriptions.

### Removed

- Redundant descriptions from general settings.

## [2.22.0] - 2019-05-13

### Added

- `disableSSR` setting to test CSR stores.

## [2.21.1] - 2019-05-10

### Added

- New `useDataPixel` hook to replace `DataLayerApolloWrapper`.

### Changed

- Remove deprecated `DataLayerApolloWrapper` and move wrappers to function components.

### Fixed

- Meta description in product wrapper not placed in page.

## [2.21.0] - 2019-05-10

### Added

- `PWAProvider` inside `StoreWrapper` to allow `PWAContext` to work properly.

## [2.20.2] - 2019-05-10

### Fixed

- Fetch more on search-result was always fetching 10 more items, and not fetching maxItemsPerPage prop set.

## [2.20.1] - 2019-05-10

### Changed

- **SearchContext**: Get `map` from URL query string, if available on `createInitialMap`.

## [2.20.0] - 2019-05-10

### Added

- Create `CustomWrapper` that will add meta-tags on landing pages.

## [2.19.2] - 2019-05-09

### Fixed

- Add default `storeTitle` in title when `titleTag` and `params.term` is null.

## [2.19.1] - 2019-05-08

### Fixed

- Added more levels of search subcategories to prevent old Portal from opening with more complex searches.

## [2.19.0] - 2019-05-08

### Added

- Added content placeholder on top level store blocks.

## [2.18.1] - 2019-05-08

### Fixed

- Correctly pass withFacets parameter on productSearch query.

## [2.18.0] - 2019-05-07

### Changed

- Uses categoryTree property from store-resources instead of categories for breadcrumb props

## [2.17.5] - 2019-05-07

### Removed

- Temporarily stop using `hideUnavailableItems` prop on `SearchContext` to make search filters work again.

## [2.17.4] - 2019-05-06

### Fixed

- Remove the default 'Sort By' option on `OrderBy` component.

## [2.17.3] - 2019-05-06

### Added

- Prop `hideUnavailableItems` on `SearchContext`.

## [2.17.2] - 2019-05-02

### Fixed

- `SearchWrapper`: Fix bad rebase and decode URI when getting page title again.

## [2.17.1] - 2019-05-02

## [2.17.0] - 2019-05-01

### Changed

- Use `productSearchV2` query.

## [2.16.1] - 2019-04-30

### Fixed

- `SearchWrapper`: Decode URI when getting page title.

## [2.16.0] - 2019-04-29

### Added

- Add `refetch` parameter to `ProductContext`

## [2.15.1] - 2019-04-29

### Fixed

- Prevent infinite error loop if image is undefined.

## [2.15.0] - 2019-04-26

### Changed

- Split query and map used in facets from search.

## [2.14.2] - 2019-04-26

### Fixed

- Append the URL hash to the `returnUrl` param to login.

## [2.14.1] - 2019-04-25

### Fixed

- Error when splashes are null.

## [2.14.0] - 2019-04-25

### Added

- Support for product review interfaces.

## [2.13.0] - 2019-04-25

### Deprecated

- `rest` parameter in search routes.

### Added

- Add generic route for search.

## [2.12.4] - 2019-04-25

### Fixed

- Search title and meta description not reflecting API result.

## [2.12.3] - 2019-04-16

### Fixed

- Fix access `/account` route without any challenge.

## [2.12.2] - 2019-04-12

### Changed

- Update `pwa-graphql` to 1.x.

## [2.12.1] - 2019-04-12

### Changed

- Pass `navigationRoute` to history's replace in `StoreWrapper`.

## [2.12.0] - 2019-04-10

### Added

- Add support for `flex-layout`.

## [2.11.0] - 2019-04-04

### Added

- Add `rich-text` as allowed store block.

## [2.10.0] - 2019-04-03

### Added

- Add `newsletter` as allowed store block.

## [2.9.5] - 2019-04-01

### Added

- Add new allowed `notification.bar`.

## [2.9.4] - 2019-03-28

### Fixed

- Toast proptypes warnings.

## [2.9.3] - 2019-03-26

### Fixed

- Fix maximum call stack size exceeded error in helmet.

## [2.9.2] - 2019-03-26

### Changed

- Explicitly allow conditions on `store` interface

## [2.9.1] - 2019-03-22

### Changed

- Remove iconpack.

## [2.9.0] - 2019-03-22

### Added

- Add the toast persistence logic as we know if there is a toast visible.

## [2.8.0] - 2019-03-18

### Changed

- `vtex.orderplaced` is back!

## [2.7.3] - 2019-03-11

### Fixed

- Add `vtex.store-components` as a dependency.

## [2.7.2] - 2019-03-11

### Added

- Added the `NetworkStatusToast` component to the store.

## [2.7.1] - 2019-03-08

### Removed

- Remove `order-placed` app because isn't work properly with pixel archtecture.

## [2.7.0] - 2019-03-08

### Added

- Add `vtex.request-capture` and `vtex.store-sitemap` as a peer dependency.

## [2.6.0] - 2019-03-01

### Added

- Add new `checkout/orderPlaced` route to render `OrderPlaced` app
- Interface for `store.order-placed`

## [2.5.7] - 2019-02-28

### Added

- Add updateOrderFormCheckin mutation to OrderFormProvider

## [2.5.6] - 2019-02-26

### Removed

- Removed address-locator dependency.

## [2.5.5] - 2019-02-26

### Added

- Add favicon's <link> to the store. Configurable through the admin settings.

## [2.5.4] - 2019-02-25

### Fixed

- OrderBy using none instead of invalid value

## [2.5.3] - 2019-02-25

## [2.5.2] - 2019-02-25

### Fixed

- Add default orderBy to relevance

## [2.5.1] - 2019-02-25

### Fixed

- Add search term in title tag and keywords on search pages.

## [2.5.0] - 2019-2-22

### Added

- Add new interface `store.custom` to enable user routes

## [2.4.0] - 2019-02-21

### Removed

- Remove `info-card` from `interfaces.json`

## [2.3.2] - 2019-02-21

### Fixed

- Attribute `className` on svg file.

## [2.3.1] - 2019-02-21

### Fixed

- Loading icon didn't indicate the loading properly.

## [2.3.0] - 2019-02-20

### Added

- Using `json+ld`to `Linked Data` instead `MicroData`.

## [2.2.4] - 2019-02-18

### Fixed

- Remove `related-products` block from `store.product`.

## [2.2.3] - 2019-02-15

### Changed

- rename `hero-header` to `info-card`

## [2.2.2] - 2019-02-15

### Added

- Add `hero-header` to allowed interfaces and declare as extensible

## [2.2.1] - 2019-02-15

### Added

- Create `promo-bar` to allowed interfaces and declare as extensible

## [2.2.0] - 2019-02-15

### Added

- `highlight-overlay` to `storeWrapper` allowed interfaces and corresponding `ExtensionPoint` to `StoreWrapper` implementation.

## [2.1.2] - 2019-02-14

## [2.1.1] - 2019-02-14

## [2.1.0] - 2019-02-12

### Fixed

- Now, SKU list is rendered as an offer in `MicroData`.

### Added

- Add SKU id in Product's microdata.

### Fixed

- Only seller that has match with the skuId can sell the item.

## [2.0.5] - 2019-02-08

### Changed

- Removed usage of old context api.

## [2.0.4] - 2019-02-08

### Added

- Added `nav-home` to iconpack.

## [2.0.3] - 2019-02-07

### Fixed

- Updated iOS icons query.

## [2.0.2] - 2019-02-05

### Added

- Export default iconpack using styles builder

## [2.0.1] - 2019-02-05

### Fixed

- Fix typo on `ProfileChallenge` state, making impossible to render anything.

## [2.0.0] - 2019-02-01

### Removed

- Remove default `IconPack`. Now, it's served by render.

## [2.0.0-rc.3] - 2019-02-01

### Changed

- Remove unused icons and rename icons without pattern.

## [2.0.0-rc.2] - 2019-01-30

## [2.0.0-rc.1] - 2019-01-30

## [2.0.0-rc.0] - 2019-1-29

### Changed

- Release with new store builder

## [2.0.0-rc] - 2019-01-28

### Added

- Basic challenge blocks.
- Interface preview
- Use outer blocks (before, around, after).
- Move pixel apps to inside an iframe.
- Add `rebuy` and `address-locator` on interfaces.
- Bye `pages.json`! Welcome `store-builder`.

### Changed

- Update messages builder to `1.x`.
- Add challenge block on the `store` interface.
- Minor changes on interfaces and routes.
- Add loading svg on icon pack.
- Adjust the way to import render components.
- Update React builder to 3.x.
- Bump vtex.styleguide to 9.x.
- Move `productPreviewFragment` to `vtex.store-resources`.
- Move all OrderForm mutations to `vtex.store-resources`.
- Bump delivery dependencies.

### Removed

- GTM script and manifest configuration.
- Auth in the account route.

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

- _HotFix_ undefined verification in the `ProductSearchContextProvider`.

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

- _Hot Fix_ Data might be undefined.

## [1.9.3] - 2018-08-08

### Added

- Function to add a new item into the orderForm.

### Fixed

- Mutation of the update orderForm items function.

## [1.9.2] - 2018-08-07

### Fixed

- _Hot Fix_ Fix error titleTag of undefined.

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

- _Hotfix_ Remove `benefitsProduct` of productQuery.

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
