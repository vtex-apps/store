import React from 'react'

export const withRuntimeContext = Comp => {
  return class extends React.Component {
    runtime = { account: 'Account' }

    static displayName = 'withRuntime'

    render() {
      return <Comp runtime={this.runtime} {...this.props} />
    }
  }
}

export const useRuntime = () => ({
  account: 'storecomponents',
  navigate: jest.fn(),
  hints: {
    mobile: false,
  },
  rootPath: '',
})

export const ExtensionPoint = () => <div> Extension Point </div>
