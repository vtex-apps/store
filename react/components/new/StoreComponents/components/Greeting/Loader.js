import React from 'react'
import ContentLoader from 'react-content-loader'

const GreetingLoading = props => (
  <ContentLoader
    height={32}
    width={300}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    className="v-mid"
    data-testid="greeting-loader"
    {...props}
  >
    <rect rx="1" ry="1" width="300" height="32" />
  </ContentLoader>
)

export default GreetingLoading
