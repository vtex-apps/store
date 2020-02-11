import React from 'react'

const ContentLoad = ({ children, ['data-testid']:testId }) => (
  <svg className="content-loader-mock" {...(testId ? { 'data-testid': testId }:{})} >{children}</svg>
)

export default ContentLoad
