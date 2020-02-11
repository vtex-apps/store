import React, { useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { useRuntime, canUseDOM } from 'vtex.render-runtime'
import SearchAction from 'vtex.structured-data/SearchAction'
import useDataPixel from './hooks/useDataPixel'
import Header from './components/new/header'
import Carousel from './components/new/Carousel/Carousel'
import Row from './components/new/FlexLayout/Row'
import Col from './components/new/FlexLayout/Col'
import StoreImage from './components/new/StoreImage/Image'
import RichText from './components/new/RichText'
import Shelf from './components/new/Shelf/Shelf'
import InfoCard from './components/new/StoreComponents/InfoCard'
import Newsletter from './components/new/StoreComponents/Newsletter'
import Footer from './components/new/Footer/Footer'

const Deals = () => {
  return (
    <div>
      <Row blockClass="deals">
        <Col>
          <StoreImage src="https://storecomponents.vteximg.com.br/arquivos/box.png" maxHeight="24px" />
          <RichText text="Free shipping" blockClass="deals" />
        </Col>
        <Col>
          <StoreImage src="https://storecomponents.vteximg.com.br/arquivos/delivery-fast.png" maxHeight="24px" />
          <RichText text="One day delivery" blockClass="deals" />
        </Col>
        <Col>
          <StoreImage src="https://storecomponents.vteximg.com.br/arquivos/store.png" maxHeight="24px" />
          <RichText text="Pick up in store" blockClass="deals" />
        </Col>
        <Col>
          <StoreImage src="https://storecomponents.vteximg.com.br/arquivos/coupon.png" maxHeight="24px" />
          <RichText text="Exclusive deals" blockClass="deals" />
        </Col>
      </Row>
    </div>
  )
}

const FixedHome = () => {
  return <div>
    <Header />
    <Carousel autoplay={false} banners={
      [{
        "image": "https://storecomponents.vteximg.com.br/arquivos/banner-principal.png",
        "mobileImage": "https://storecomponents.vteximg.com.br/arquivos/banner-principal-mobile.jpg"
      },
      {
        "image": "https://storecomponents.vteximg.com.br/arquivos/banner.jpg",
        "mobileImage": "https://storecomponents.vteximg.com.br/arquivos/banner-principal-mobile.jpg"
      }]
    }
      height={720}
      showArrows
      showDots
    />
    <Deals />
    <Shelf orderBy="OrderByTopSaleDESC" paginationDotsVisibility="desktopOnly" skusFilter="FIRST_AVAILABLE" productList={{
      "maxItems": 10,
      "itemsPerPage": 5,
      "minItemsPerPage": 1,
      "scroll": "BY_PAGE",
      "arrows": true,
      "titleText": "Top sellers"
    }} />
    <InfoCard id="info-card-home" isFullModeStyle={false} textPosition="left" imageUrl="https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png" headline="Clearance Sale" callToActionText="DISCOVER" callToActionUrl="/sale/d/" blockClass="info-card-home" textAlignment="center" />
    <RichText text="**This is an example store built using the VTEX platform.\nWant to know more?**" blockClass="question" />
    <RichText text="\n**Reach us at**\nwww.vtex.com.br" blockClass="link" />
    <Newsletter />
    <Footer />
  </div>
}

const HomeWrapper = ({ children }) => {
  const { account, route } = useRuntime()

  const pixelEvents = useMemo(() => {
    if (!canUseDOM) {
      return null
    }

    return [
      {
        event: 'pageInfo',
        eventType: 'homeView',
        accountName: account,
        pageTitle: document.title,
        pageUrl: location.href,
        pageCategory: 'Home',
      },
    ]
  }, [account])

  useDataPixel(pixelEvents, route.routeId)

  return (
    <Fragment>
      <SearchAction />
      <FixedHome />
    </Fragment>
  )
}

HomeWrapper.propTypes = {
  children: PropTypes.element,
}

export default HomeWrapper
