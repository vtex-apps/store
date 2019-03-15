# VTEX Store Framework

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

## Events dispatched to the Pixel Component

- Home: `homeView` event.

- Product: `productView` event.

- Department: `departmentView` event.

- Category: `categoryPath` event.

- Internal Site Search: `internalSiteSearchView` event.

- Other: `otherView` event.

## Store builder
Please refer to [Store builder](./STORE_BUILDER.md)
