class Pixel {
  constructor() {
    if (!window.dataLayer) {
      window.dataLayer = []
    }
  }

  push = data => {
    window.dataLayer.push(data)
  }

  dispatchEvent = (name, data) => {
    this.push({
      event: name,
      ...data
    })
  }
}

export default Pixel