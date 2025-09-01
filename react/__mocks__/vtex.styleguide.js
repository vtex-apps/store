const React = require('react')

module.exports = {
  ToastContext: React.createContext({
    showToast: jest.fn(),
    hideToast: jest.fn(),
    toastState: {
      currentToast: null,
      isToastVisible: false,
    },
  }),
}
