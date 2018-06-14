# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
