import React from 'react'
import { injectIntl, IntlShape, defineMessages } from 'react-intl'

const messages = defineMessages({
    greeting: {
      id: 'store/store.example-app',
      defaultMessage: 'Say hello to {name}!',
      description: 'Asking to greet a person with a cool name',
    },
  })


const Example = ({ name, intl }: { name: string, intl: IntlShape }) => {
    const { formatMessage } = intl
    return (
    <div>
        <h1>Example App</h1>
        {formatMessage(messages.greeting, {name: <b>{name}</b>})}
    </div>
    )
}

// Example.schema = {
//     type: 'object',
//     properties: {
//         name: {
//             title: 'name',
//             description: 'a cool name',
//             type: 'string'
//         }
//     }
// }


export default injectIntl(Example)