export const LoginSchema = {
  type: 'object',
  properties: {
    optionsTitle: {
      title: 'admin/editor.login.optionsTitle',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    emailAndPasswordTitle: {
      title: 'admin/editor.login.emailAndPasswordTitle',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    accessCodeTitle: {
      title: 'admin/editor.login.accessCodeTitle',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    emailPlaceholder: {
      title: 'admin/editor.login.emailPlaceholder',
      type: 'string',
    },
    passwordPlaceholder: {
      title: 'admin/editor.login.passwordPlaceholder',
      type: 'string',
    },
    showPasswordVerificationIntoTooltip: {
      title: 'admin/editor.login.showPasswordVerificationIntoTooltip.title',
      type: 'boolean',
      isLayout: true,
    },
    accessCodePlaceholder: {
      title: 'admin/editor.login.accessCodePlaceholder',
      type: 'string',
    },
    showIconProfile: {
      title: 'admin/editor.login.showIconProfile',
      type: 'boolean',
    },
    iconLabel: {
      title: 'admin/editor.login.iconLabel',
      type: 'string',
    },
    providerPasswordButtonLabel: {
      title: 'admin/editor.login.providerPasswordButtonLabel',
      type: 'string',
    },
    hasIdentifierExtension: {
      title: 'admin/editor.login.hasIdentifierExtension',
      type: 'boolean',
    },
  },
  dependencies: {
    hasIdentifierExtension: {
      oneOf: [
        {
          properties: {
            hasIdentifierExtension: {
              enum: [true],
            },
            identifierPlaceholder: {
              title: 'admin/editor.login.identifierPlaceholder',
              type: 'string',
            },
            invalidIdentifierError: {
              title: 'admin/editor.login.invalidIdentifierError',
              type: 'string',
            },
          },
        },
      ],
    },
  },
}
