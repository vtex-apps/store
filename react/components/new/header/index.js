import React from 'react'
import Row from './components/Row'
import Spacer from './components/Spacer'
import Logo from '../StoreComponents/Logo'
import Menu from '../Menu/Menu'
import MenuItem from '../Menu/MenuItem'
import Submenu from '../Menu/Submenu'
import FlexCol from  '../FlexLayout/Col'
import FlexRow from  '../FlexLayout/FlexLayout'
import InfoCard from '../StoreComponents/InfoCard'
import Drawer from '../Drawer/Drawer'
import SearchBar from '../StoreComponents/SearchBar'
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher'
import Login from '../Login/Login'
import Minicart from '../Minicart/index'
import NotificationBar from '../StoreComponents/NotificationBar'
// import MinicartBase from '../Minicart/BaseContent'
// import ProductList from '../Minicart/ProductList'
// import Sticky from '../Sticky'

import useDevice from '../DeviceDetector/useDevice'

// import CustomHeader from './components/CustomHeader'

// "header-layout.desktop": {
//   "children": [
//     "header-row#1-desktop",
//     "header-row#2-desktop",
//     "header-row#3-desktop",
//     "header-row#4-desktop"
//   ]
// },

// "header-row#1-desktop": {
//   "children": ["telemarketing"],
//   "props": {
//     "fullWidth": true
//   }
// },

// "header-row#2-desktop": {
//   "children": ["notification.bar#home"],
//   "props": {
//     "fullWidth": "true"
//   }
// },
// "notification.bar#home": {
//   "props": {
//     "content": "SELECTED ITEMS ON SALE! CHECK IT OUT!"
//   }
// },
// "header-row#3-desktop": {
//   "children": [
//     "vtex.menu@2.x:menu#websites",
//     "header-spacer",
//     "vtex.menu@2.x:menu#institutional"
//   ],
//   "props": {
//     "blockClass": "menu-link",
//     "inverted": "true"
//   }
// },
// "header-row#4-desktop": {
//   "children": [
//     "logo#desktop",
//     "vtex.menu@2.x:menu#category-menu",
//     "header-spacer",
//     "header-spacer",
//     "search-bar",
//     "locale-switcher",
//     "login",
//     "minicart.v2"
//   ],
//   "props": {
//     "sticky": true,
//     "blockClass": "main-header"
//   }
// },
// "logo#desktop": {
//   "props": {
//     "title": "Logo",
//     "href": "/",
//     "url": "https://storecomponents.vteximg.com.br/arquivos/store-theme-logo.png",
//     "width": "180"
//   }
// },
// "header-layout.mobile": {
//   "children": ["header-row#1-mobile"]
// },
// "header-row#1-mobile": {
//   "children": [
//     "drawer",
//     "logo#mobile",
//     "header-spacer",
//     "login",
//     "minicart.v2"
//   ],
//   "props": {
//     "sticky": true,
//     "blockClass": "main-header-mobile"
//   }
// },
// "drawer": {
//   "children": ["menu#drawer"]
// },

// "menu#drawer": {
//   "children": [
//     "menu-item#category-apparel",
//     "menu-item#category-home",
//     "menu-item#more"
//   ],
//   "props": {
//     "orientation": "vertical"
//   }
// },

// "logo#mobile": {
//   "props": {
//     "title": "Logo",
//     "href": "/",
//     "url": "https://storecomponents.vteximg.com.br/arquivos/store-theme-logo-mobile.png",
//     "width": "70"
//   }
// }
// }

// "minicart-base-content": {
//   "blocks": ["minicart-empty-state"],
//   "children": ["minicart-product-list", "sticky-layout#minicart-footer"]
// },

const CategoryMenu = () => (
  <MenuItem id="menu-item-category-apparel" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/apparel---accessories/", noFollow: false, tagTitle:"Apparel & Accessories", text:"Apparel & Accessories"}}>
    <Submenu width="auto">
      <Menu orientation="vertical">
        <MenuItem id="menu-item-category-apparel-clothing" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/apparel---accessories/clothing/", noFollow: false, tagTitle:"Clothing", text:"Clothing"}}/>
        <MenuItem id="menu-item-category-apparel-accessories" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/apparel---accessories/accessories/", noFollow: false, tagTitle:"Accessories", text:"Accessories"}}/>
        <MenuItem id="menu-item-category-apparel-eyeglasses" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/apparel---accessories/eyeglasses/", noFollow: false, tagTitle:"Eyeglasses", text:"Eyeglasses"}}/>
      </Menu>
    </Submenu>
  </MenuItem>
)

const MenuMore = () => (
  <MenuItem id="menu-item-custom-sale" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "#", noFollow: false, tagTitle:"More", text:"More"}}>
    <Submenu width="100%">
      <FlexRow>
        <FlexCol>
          <Menu orientation="vertical">
            <MenuItem id="menu-item-about-us" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/about-us", noFollow: false, tagTitle:"About us", text:"About us"}} />
          </Menu>
        </FlexCol>
        <FlexCol>
          <InfoCard id="info-card-home" isFullModeStyle={false} textPosition="left" imageUrl="https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png" headline="Clearance Sale" callToActionText="DISCOVER" callToActionUrl="/sale/d" blockClass="info-card-home" textAlignment="center" />
        </FlexCol>
      </FlexRow>
    </Submenu>
  </MenuItem>
)

const DesktopHeader = () => {
  return (
    <div>
      <Row fullWidth>
        <NotificationBar content="SELECTED ITEMS ON SALE! CHECK IT OUT!" />
      </Row>
      <Row blockClass="menu-link" inverted>
        <Menu>
          <MenuItem id="menu-item-shop" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "#", noFollow: false, tagTitle:"Shop", text:"Shop"}} />
          <MenuItem id="menu-item-about-us" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/about-us", noFollow: false, tagTitle:"about-us", text:"About Us"}} />
        </Menu>
        <Spacer />
        <Menu>
          <MenuItem id="menu-item-vtex-website" type="custom" iconId={null} highlight={false} itemProps={{ type: "external", href: "http://vtex.com", noFollow: false, tagTitle:"visit vtex.com", text:"visit vtex.com"}} />
        </Menu>
      </Row>
      <Row blockClass="main-header" sticky>
        <Logo title="Logo" href="/" url="https://storecomponents.vteximg.com.br/arquivos/store-theme-logo.png" width="180" />
        <Menu>
          <CategoryMenu />
          <MenuItem id="menu-item-category-home" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/home---decor/", noFollow: false, tagTitle:"Home & Decor", text:"Home & Decor"}}/>
          <MenuMore />
        </Menu>
        <Spacer />
        <Spacer />
        <SearchBar />
        <LocaleSwitcher />
        <Login />
        <Minicart type="popup" showRemoveButton showDiscount showSku labelMiniCartEmpty="" labelButtonFinishShopping="Go to checkout" enableQuantitySelector maxQuantity={10} labelClasses="gray" productSummaryProps={{}}/>
      </Row>
    </div>
  ) 
}

const MobileHeader = () => {
  return (
    <Row blockClass="main-header-mobile" sticky>
      <Drawer>
        <CategoryMenu />
        <MenuItem id="menu-item-category-home" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/home---decor/", noFollow: false, tagTitle:"Home & Decor", text:"Home & Decor"}}/>
        <MenuMore />
      </Drawer>
      <Logo title="Logo" href="/" url="https://storecomponents.vteximg.com.br/arquivos/store-theme-logo-mobile.png" width="70" />
      <Spacer />
      <Login />
      <Minicart type="popup" showRemoveButton showDiscount showSku labelMiniCartEmpty="" labelButtonFinishShopping="Go to checkout" enableQuantitySelector maxQuantity={10} labelClasses="gray" productSummaryProps={{}}/>
    </Row>
  )
}

const Header = () => {
  const { isMobile } = useDevice()
  return isMobile ? <MobileHeader/> : <DesktopHeader />
}

// Header.schema = LegacyHeader.schema

export default Header
