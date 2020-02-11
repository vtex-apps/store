declare module 'vtex.device-detector' {
  interface Device {
    device: 'phone' | 'tablet' | 'desktop'
    isMobile: boolean
  }

  export function useDevice(): Device
}
