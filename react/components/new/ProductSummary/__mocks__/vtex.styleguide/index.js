import React, { Component } from 'react'

export class Spinner extends Component {
  render() {
    return <div>Spinner</div>
  }
}

export class NumericStepper extends Component {
  render() {
    return <div>NumericStepper</div>
  }
}

export function withToast(Comp) {
  return Comp
}
