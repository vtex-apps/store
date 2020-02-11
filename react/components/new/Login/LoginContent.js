import React, { Component, Suspense } from 'react'
import LoginContent from './components/LoginContent'
import { NoSSR } from 'vtex.render-runtime'
import Loading from './components/Loading'

const LoginContentWrapper = props => {
  return (
    <NoSSR>
      <Suspense fallback={<Loading />}>
        <LoginContent {...props} />
      </Suspense>
    </NoSSR>
  )
}

LoginContentWrapper.getSchema = () => ({
  title: 'admin/editor.loginPage.title',
  ...LoginSchema,
  properties: {
    ...LoginSchema.properties,
    isInitialScreenOptionOnly: {
      title: 'admin/editor.login.isInitialScreenOptionOnly.title',
      type: 'boolean',
      default: true,
      isLayout: true,
    },
    defaultOption: {
      title: 'admin/editor.login.defaultOption.title',
      type: 'number',
      default: 0,
      isLayout: true,
      enum: [0, 1],
      enumNames: [
        'admin/editor.login.defaultOption.token',
        'admin/editor.login.defaultOption.emailAndPassword',
      ],
      widget: {
        'ui:widget': 'radio',
        'ui:options': {
          inline: true,
        },
      },
    },
  },
})

export default LoginContentWrapper