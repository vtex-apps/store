import React from 'react'
import useDevice from '../DeviceDetector/useDevice'
import Row from './Row'
import Spacer from './Spacer'
import SocialNetworks from './SocialNetworks'
import Menu from '../Menu/Menu'
import MenuItem from '../Menu/MenuItem'
import AcceptedPaymentMethods from './AcceptedPaymentMethods'
import RichText from '../RichText'
import SubmenuAccordion from '../Menu/SubmenuAccordion'

const Desktop = () => {
  return (
    <div>
    <Row blockClass="menu-row" paddingTop={6} paddingBottom={3}>
      <Menu orientation="vertical">
        <MenuItem id="menu-item-news" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "#", noFollow: true, tagTitle:"News", text:"News"}}/>
        <MenuItem id="menu-item-black-friday" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "#", noFollow: true, tagTitle:"BlackFriday", text:"Black Friday"}}/>
        <MenuItem id="menu-item-sale" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "#", noFollow: true, tagTitle:"Sale", text:"Sale"}}/>
        <MenuItem id="menu-item-personalization" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "#", noFollow: true, tagTitle:"Personalization", text:"Personalization"}}/>
      </Menu>
      <Menu orientation="vertical">
        <MenuItem id="menu-item-category-clothing" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/d", noFollow: true, tagTitle:"Clothing", text:"Clothing"}}/>
        <MenuItem id="menu-item-shorts" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/shorts", noFollow: true, tagTitle:"Shorts", text:"Shorts"}}/>
        <MenuItem id="menu-item-tank-tops" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/tank-tops", noFollow: true, tagTitle:"Tank Tops", text:"Tank Tops"}}/>
        <MenuItem id="menu-item-shirts" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/shirts", noFollow: true, tagTitle:"Shirts", text:"Shirts"}}/>
        <MenuItem id="menu-item-sweat-shirts" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/sweatshirt", noFollow: true, tagTitle:"Sweatshirt", text:"Sweatshirt"}}/>
        <MenuItem id="menu-item-cropped" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/cropped", noFollow: true, tagTitle:"Cropped", text:"Cropped"}}/>
      </Menu>
      <Menu orientation="vertical">
        <MenuItem id="menu-item-smartphones" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/decoration/smartphones", noFollow: true, tagTitle:"Smartphones", text:"Smartphones"}}/>
        <MenuItem id="menu-item-videogames" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/decoration/videogames", noFollow: true, tagTitle:"Videogames", text:"Videogames"}}/>
        <MenuItem id="menu-item-tvs" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/decoration/tvs", noFollow: true, tagTitle:"TVs", text:"TVs"}}/>
      </Menu>
      <Menu orientation="vertical">
        <MenuItem id="menu-item-bags" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/bags/d", noFollow: true, tagTitle:"Bags", text:"Bags"}}/>
        <MenuItem id="menu-item-backpacks" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/bags/backpacks", noFollow: true, tagTitle:"Backpacks", text:"Backpacks"}}/>
        <MenuItem id="menu-item-necessaire" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/bags/necessaire", noFollow: true, tagTitle:"Necessaire", text:"Necessaire"}}/>
      </Menu>
      <Spacer />
      <SocialNetworks socialNetworks={[
        {
          "name": "Facebook",
          "url": "https://www.facebook.com/vtexonline/"
        },
        {
          "name": "Instagram",
          "url": "https://www.instagram.com/vtextruecloud/"
        },
        {
          "name": "Twitter",
          "url": "https://twitter.com/vtexonline"
        },
        {
          "name": "Youtube",
          "url": "https://www.youtube.com/user/VTEXTV"
        }
      ]}/>
    </Row>
    <Row blockClass="payment-methods">
      <AcceptedPaymentMethods paymentMethods={["MasterCard", "Visa", "Diners Club"]} />
    </Row>
    <Row blockClass="credits">
      <RichText text="All stock and product photos are from photos.icons8.com" blockClass="footer"/>
    </Row>
    </div>
  )
}

const Mobile = () => {
  return (
    <div>
      <Row paddingTop={4} paddingBottom={4}>
      <Menu orientation="vertical">
        <MenuItem id="menu-item-category-clothing" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/d", noFollow: true, tagTitle:"Clothing", text:"Clothing"}}>
          <SubmenuAccordion>
            <Menu orientation="vertical">
              <MenuItem id="menu-item-category-clothing" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/d", noFollow: true, tagTitle:"Clothing", text:"Clothing"}}/>
              <MenuItem id="menu-item-shorts" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/shorts", noFollow: true, tagTitle:"Shorts", text:"Shorts"}}/>
              <MenuItem id="menu-item-tank-tops" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/tank-tops", noFollow: true, tagTitle:"Tank Tops", text:"Tank Tops"}}/>
              <MenuItem id="menu-item-shirts" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/shirts", noFollow: true, tagTitle:"Shirts", text:"Shirts"}}/>
              <MenuItem id="menu-item-sweat-shirts" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/sweatshirt", noFollow: true, tagTitle:"Sweatshirt", text:"Sweatshirt"}}/>
              <MenuItem id="menu-item-cropped" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/clothing/cropped", noFollow: true, tagTitle:"Cropped", text:"Cropped"}}/>
            </Menu>
          </SubmenuAccordion>
        </MenuItem>
        <MenuItem itemProps={{ "tagTitle": "Decoration", "text": "Decoration" }}>
          <SubmenuAccordion>
            <MenuItem id="menu-item-smartphones" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/decoration/smartphones", noFollow: true, tagTitle:"Smartphones", text:"Smartphones"}}/>
            <MenuItem id="menu-item-videogames" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/decoration/videogames", noFollow: true, tagTitle:"Videogames", text:"Videogames"}}/>
            <MenuItem id="menu-item-tvs" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/decoration/tvs", noFollow: true, tagTitle:"TVs", text:"TVs"}}/>
          </SubmenuAccordion>
        </MenuItem>
        <MenuItem itemProps={{ "tagTitle": "Sale", "text": "Sale" }}>
          <SubmenuAccordion>
            <MenuItem id="menu-item-smartphones" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/decoration/smartphones", noFollow: true, tagTitle:"Smartphones", text:"Smartphones"}}/>
            <MenuItem id="menu-item-videogames" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/decoration/videogames", noFollow: true, tagTitle:"Videogames", text:"Videogames"}}/>
            <MenuItem id="menu-item-tvs" type="custom" iconId={null} highlight={false} itemProps={{ type: "internal", href: "/decoration/tvs", noFollow: true, tagTitle:"TVs", text:"TVs"}}/>
          </SubmenuAccordion>
        </MenuItem>
      </Menu>
      </Row>
      <Row>

      </Row>
    </div>
  )
}

const Footer = () => {
  const { isMobile } = useDevice()
  return isMobile ? <Mobile /> : <Desktop />
}

Footer.schema = {
  title: 'admin/editor.footer.title',
  description: 'admin/editor.footer.description',
  type: 'object',
  properties: {
    showPaymentFormsInColor: {
      type: 'boolean',
      title: 'admin/editor.footer.showPaymentMethodsInColor.title',
      default: false,
      isLayout: true,
    },
    showSocialNetworksInColor: {
      type: 'boolean',
      title: 'admin/editor.footer.showSocialNetworksInColor.title',
      default: false,
      isLayout: true,
    },
    showVtexLogoInColor: {
      type: 'boolean',
      title: 'admin/editor.footer.showVtexLogoInColor.title',
      default: false,
      isLayout: true,
    },
  },
}

export default Footer
