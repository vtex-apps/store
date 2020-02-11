declare module 'vtex.device-detector' {
  export function useDevice(): {
    device: 'desktop' | 'tablet' | 'phone'
    isMobile: boolean
  }
}
