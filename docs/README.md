# VTEX Store Framework
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Framework that is used by all ecommerce stores build on VTEX IO.

⚠️⚠️ **All stores MUST use this app. Using a forked version WILL break your store.** ⚠️⚠️

## Table of Contents

- [Description](#description)
- [Release schedule](#release-schedule)
- [Store Builder](#store-builder)
  - [Overview](#overview)
  - [Blocks Language](#blocks-language)
  - [Interface Structure](#interface-structure)
  - [Recipes](#recipes)
- [Blocks Reference](#blocks-reference)
- [Pixel Architecture](#pixel-architecture)
- [Contributing](#contributing)

## Description

Store Framework is responsible for defining the basic structure of any ecommerce store of the platform. With this app, we want to provide an abstraction for our clients and partners not worry about SEO and fetch basic data from VTEX. Any account has this app installed.

This project has the following capabilities:

- Setup metatags for all pages. 
- Fetch product and products search data from VTEX APIs 
- Dispatch view events to analytics tools. 
- Define the necessary interfaces and routes of the store.

## Release schedule

| Release |       Status        | Initial Release | Maintenance LTS Start | End-of-life | Store Compatibility |
| :-----: | :-----------------: | :-------------: | :-------------------: | :---------: | :-----------------: |
|  [2.x]  | **Current Release** |   2018-11-28    |                       |             |         2.x         |
|  [1.x]  | **Maintenance LTS** |   2018-08-21    |      2018-11-28       | March 2019  |         1.x         |

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Store Builder

VTEX IO created a powerful way to configure the behavior [React](https://reactjs.org/) components yielding the basic building *blocks* for a web app.

IO **store builder** is a opinionated way to use IO capabilities to quickly build store components that can be reused
across ecommerce stores and interact seamlessly with its APIs and existing components.

### Overview 

The Store builder allows you to extend existing blocks, like the ones provided by the Store Framework, allowing them to replace the blocks they extend via the VTEX IO Content Management System (CMS). They also allow you to build new blocks that provide functionality specific to your business needs and, then, create templates to insert those new blocks in your clients' ecommerce store while still benefiting from the continuous progress made by the native store components and it's extensions on the other parts of your store.

### Blocks Language

Blocks are instances of configured React components that follow a defined contract - or *interface*.
Blocks can be shared between apps and can contain other blocks. They can be used to create simple widgets 
like buttons and forms, ready to use features like a review system or whole web pages.

To create web pages - or *templates*, a block must be acessible by a **route**. Routes associate blocks with paths that 
can be used to match URLS. These **templates** are configurable in VTEX IO CMS.

Apps can also insert its blocks on specific page components as soon as the app is installed, via **plugins**.
Plugins provide an easy way to add specific functionality in a plug and play fashion to any store - 
e.g. Visa Checkout button on the shopping cart, 360º image on the product galery.

To ensure that blocks would be reusable across stores, any VTEX IO store contain a set of *interfaces* 
which blocks must implement. **Interfaces** are contracts that define the block component and which interfaces 
it may contain, among other constraints.

The store builder validates and exports blocks, routes, interfaces and plugins defined in the app.
This allows the admin CMS and the store to use them. The configuration files which declares those
components must be in the `store/` folder on the root of the app. 
The following sections we detail more about this concepts. 

### Interface Structure
[TODO]
Explain interface structure, how it make stores "compatible" and its components reusable.

### Recipes
[TODO]

How to extend VTEX Store interfaces?

How to create a block / interface / route / plugin?

Examples, examples, examples...

## Blocks Reference

Please refer to [Blocks](./BLOCKS.md)

## Pixel Architecture

- Home: `homeView` event.

- Product: `productView` event.

- Department: `departmentView` event.

- Category: `categoryPath` event.

- Internal Site Search: `internalSiteSearchView` event.

- OrderPlaced Page: `orderPlaced` event.

- Other: `otherView` event.

### Enhanced Ecommerce

- Measuring Additions to a Shopping Cart: `addTocart` event.

- Measuring Removals from a Shopping Cart: `removeFromCart` event.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project. 

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/gustavopvasconcellos"><img src="https://avatars1.githubusercontent.com/u/49173685?v=4" width="100px;" alt=""/><br /><sub><b>gustavopvasconcellos</b></sub></a><br /><a href="https://github.com/vtex-apps/store/commits?author=gustavopvasconcellos" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
