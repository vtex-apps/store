declare module 'vtex.device-detector' {
  interface DeviceType {
    isMobile: boolean
  }
  export const useDevice: () => DeviceType
}
