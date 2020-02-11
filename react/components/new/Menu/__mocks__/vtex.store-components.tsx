import React, { Component, ReactNode } from 'react'
import PropTypes from 'prop-types'

interface Props {
  children?: ReactNode
}

/**
 * ExtensionPoint Mocked Component.
 */
export class Container extends Component<Props> {
  static readonly propTypes: Props = {
    children: PropTypes.node,
  }
  render(): ReactNode {
    return <section>{this.props.children}</section>
  }
}
