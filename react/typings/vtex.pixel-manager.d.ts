declare module 'vtex.pixel-manager/PixelContext' {
  interface Pixel {
    push(data: unknown): void
  }

  export function usePixel(): Pixel
}