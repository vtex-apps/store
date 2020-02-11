import React from 'react'
import { addValidation, removeValidation } from './helpers'
import { StyleguideInput } from './inputs'

const AddressRules = props => (
  <div className="address-rules-mock">{props.children}</div>
)

const AddressContainer = props => (
  <div className="address-container-mock">{props.children}</div>
)

const PostalCodeGetter = props => (
  <div className="postal-code-getter-mock">{props.children}</div>
)

export {
  AddressRules,
  AddressContainer,
  PostalCodeGetter,
  addValidation,
  removeValidation,
  StyleguideInput,
}
