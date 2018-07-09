# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
- Data layer intergration in the `ProductPage`.

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
