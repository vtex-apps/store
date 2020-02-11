import React from 'react'
import PropTypes from 'prop-types'

import FormTitle from './FormTitle'
import FormFooter from './FormFooter'

export default function Form({ className, title, content, footer, onSubmit, children }) {
  return (
    <div className={className}>
      <FormTitle>
        {title}
      </FormTitle>
      <form onSubmit={onSubmit}>
        {content}
        <FormFooter>
          {footer}
        </FormFooter>
        {children}
      </form>
    </div>
  )
}

Form.propTypes = {
  className: PropTypes.string,
  title: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
}
