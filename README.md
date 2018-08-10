# VTEX Store

The VTEX Store Render app

## Events dispatched to the DataLayer

- Home: `homeView` event.

- Product: `productView` event.

- Department: `departmentView` event.

- Category: `categoryPath` event.

- Internal Site Search: `internalSiteSearchView` event.

- Other: `otherView` event.


## Google Tag Manager Setup

To capture and analyze your store data on `GTM/Analytics`, you must create a tag associated with a trigger with the name of the event expected to listen, and publish them to the master workspace. Also, you have to go to the store administration and add the GTM ID on the `Apps` page. After the GTM configuration, you can access the `Google Analytics` and observe the event appearing on the dashboard.