// Insane is based on the sanitize-html package.
// So its types are extremely close to it.

declare function insane(dirty: string, options?: insane.IOptions): string

declare namespace insane {
  interface IOptions {
    allowedTags?: string[] | boolean
    allowedAttributes?: { [index: string]: string[] } | boolean
    allowedStyles?:  { [index: string]: { [index: string]: RegExp[] } }
    allowedClasses?: { [index: string]: string[] } | boolean
  }
}

declare module 'insane' {
  export = insane
}