import React, { Component, Fragment } from 'react'
import { ApolloConsumer } from 'react-apollo'

export default class ApolloWrapper extends Component {
  render() {
    return (
      <ApolloConsumer>
        {client => <GraphqlContext client={client} {...this.props} />}
      </ApolloConsumer>
    )
  }
}

class GraphqlContext extends Component {
  handleQueryExecution = (query, variables, callBack) => {
    const { client } = this.props

    client
      .query({
        query: query,
        variables: variables,
      })
      .then(queryRes => {
        const { data } = queryRes

        callBack(data)
      })
  }

  // handleMutationExecution = (mutation, variables, callBack) => {
  //   const { client } = this.props

  //   client
  //     .mutate({
  //       mutation: mutation,
  //       variables: variables,
  //       name: 'test',
  //     })
  //     .then(
  //       mutationRes => {
  //         const { data } = mutationRes

  //         callBack(data)
  //       },
  //       mutationErr => {
  //         callBack(mutationErr)
  //       }
  //     )
  // }

  render() {
    const contextProps = {
      executeQuery: this.handleQueryExecution,
      // executeMutation: this.handleMutationExecution,
    }

    return (
      <Fragment>
        {React.cloneElement(this.props.children, contextProps)}
      </Fragment>
    )
  }
}
