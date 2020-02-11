declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const Input: ComponentType<InputProps>
  export const Spinner: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }

  export const Button: ComponentType<{
    onClick: () => void
    variation?: string
    size?: string
  }>

  export const Modal: ComponentType<{
    onClose: () => void
    isOpen: boolean
    centered: boolean
    title?: string
  }>

  export const Radio: ComponentType<{
    checked: boolean
    onChange: () => void
    id: string
    label: string
    name: string
    value: string
  }>
}
