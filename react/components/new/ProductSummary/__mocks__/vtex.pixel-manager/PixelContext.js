import React from 'react'

export function Pixel(Comp) {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    render() {
      return <Comp {...this.props} push={() => {}} subscribe={() => {}} />
    }
  }
}
