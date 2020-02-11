import React, { FunctionComponent } from 'react'

const Column: FunctionComponent<Props> = props => {
  return <div>{props.children}</div>
}

interface Props {
  children: React.ReactChildren
}

export default Column
