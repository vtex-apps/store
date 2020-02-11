declare module '*.css' {
  const css: CSSHandles
  export default css
}

interface CSSHandles {
  imageElement: string
}
