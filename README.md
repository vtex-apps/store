# VTEX Store

The VTEX Store Render app

## Events dispatched to the DataLayer

### HomeView

Triggered on the home page as `homeView` event.

### ProductView

Triggered on the product page as `productView` event.

### DepartmentView

Triggered on the search page with the department path, as `departmentView` event.

### CategoryView

Triggered on the search page with the category path, as `categoryPath` event.

### InternalSiteSearchView

Triggered on the search page when the user access via search bar, as `internalSiteSearchView` event.

### OtherView

Triggered on the search page when the result comes with an empty array of products, also, on all other pages of the store, as `otherView` event.


## Google Tag Manager Setup

In order to capture and analyze your store data on `GTM/Analytics`, you must create a tag associated with a trigger with the name of the event expected to listen, and publish them to the master workspace. Also, you have to go to the store administration and add the GTM ID on the `Apps` page. After the GTM configuration, you can access the `Google Analytics` and observe the event appearing on the dashboard.