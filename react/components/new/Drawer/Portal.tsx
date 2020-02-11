import { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'
import { useSSR } from 'vtex.render-runtime'

const Portal: FunctionComponent = ({ children }) => {
  const body = window && window.document && window.document.body
  const isSSR = useSSR()

  if (!body || isSSR) {
    return null
  }

  return ReactDOM.createPortal(children, body)
}

export default Portal
