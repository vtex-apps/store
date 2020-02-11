import React, { Component } from 'react'

export const DiscountBadge = ({ children }) => {
  return <div className="discount-badge-mock">{children}</div>
}

export class ProductPrice extends Component {
  static schema = { properties: {} }

  render() {
    return <div>ProductPrice</div>
  }
}

export class ProductName extends Component {
  render() {
    return <div>ProductName</div>
  }
}
