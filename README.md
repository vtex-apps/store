# VTEX Store

Framework that is used by all ecommerce stores build on VTEX IO.

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

## Blocks Language

The store builder allows you to extend existing blocks, like the ones provided by the Store Framework, allowing them to replace the blocks they extend via the Storefront editor. They also allow you to build completely new blocks that provide functionality specific to your business needs and, then, create templates to insert those new blocks in your client's store while still benefiting from the continuous progress made by the Dream Store and it's extensions on the other parts of your store.

## Analytics

- Home: `homeView` event.

- Product: `productView` event.

- Department: `departmentView` event.

- Category: `categoryView` event.

- Internal Site Search: `internalSiteSearchView` event.

- Other: `otherView` event.
