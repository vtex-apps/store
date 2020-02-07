import React, { Component } from 'react'

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component'
}

/**
 * HOC used for lazily load an image in the 'images' folder right above
 * this component.
 *
 * Used for loading the logos for the Footer
 *
 * @param {Function} getImageFilename
 */
export default getImageFilename => {
  return WrappedComponent => {
    class WithImage extends Component {
      static displayName = `WithImage(${getDisplayName(WrappedComponent)})`
      static getSchema = WrappedComponent.getSchema
      static schema = WrappedComponent.schema

      state = {}

      _isMounted = false

      componentDidMount() {
        const imageName = getImageFilename(this.props)
        this._isMounted = true
        this.lazyImport(imageName)
      }

      componentWillUnmount() {
        this._isMounted = false
      }

      componentDidUpdate() {
        const imageName = getImageFilename(this.props)
        if (imageName !== this.state.imageName) {
          this.lazyImport(imageName)
        }
      }

      lazyImport = imageName => {
        return import(`../images/${imageName}`).then(imageSrc => {
          if (this._isMounted) {
            this.setState({ imageSrc: imageSrc.default, imageName })
          }
        })
      }

      render() {
        return (
          <WrappedComponent {...this.props} imageSrc={this.state.imageSrc} />
        )
      }
    }

    return WithImage
  }
}
