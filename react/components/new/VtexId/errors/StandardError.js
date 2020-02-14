class StandardError extends Error {
  constructor(message, code, details) {
    super(message)
    this.code = code
    if (details) {
      this.details = details
    }
  }
}

export default StandardError
