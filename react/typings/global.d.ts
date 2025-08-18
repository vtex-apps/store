interface Window extends Window {
  dataLayer: any[]
  __hostname__: string | undefined
}

declare module 'vtex.store-resources/QueryProductSearchV3' {
  const query: any
  export default query
}
