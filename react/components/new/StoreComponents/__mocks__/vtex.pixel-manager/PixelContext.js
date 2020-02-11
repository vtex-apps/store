import React from 'react'

export function Pixel(Comp) {
  return class extends React.Component {
    render() {
      return <Comp {...this.props} push={() => {}} />
    }
  }
}
