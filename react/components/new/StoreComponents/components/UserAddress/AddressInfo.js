import React, { Fragment } from 'react'
import { ExtensionPoint, useChildBlock } from 'vtex.render-runtime'
import { pathOr } from 'ramda'
import { injectIntl, FormattedMessage } from 'react-intl'
import { IconLocationMarker } from 'vtex.store-icons'

const AddressInfo = ({ inverted, inline, orderForm, intl }) => {
  const { shippingData } = orderForm
  if (!shippingData || !shippingData.address) return

  const { street, number, complement, addressType } = shippingData.address

  const displayStreet = number ? `${street}, ${number}` : street

  const displayAddress =
    complement && complement !== ''
      ? `${displayStreet} - ${complement}`
      : `${displayStreet}`

  const isPickup = addressType === 'pickup'
  const friendlyName = pathOr(
    '',
    ['pickupPointCheckedIn', 'friendlyName'],
    orderForm
  )

  const hasModal = !!useChildBlock({ id: 'modal' })

  return (
    <div className={`flex ${inline ? 'items-end' : 'items-center flex-auto'}`}>
      <div className="flex flex-auto">
        <div
          className={`mr3 flex items-center ${
            inverted ? 'c-on-base--inverted' : 'c-muted-2'
          }`}
        >
          <IconLocationMarker size={27} viewBox={'0 0 21 27'} />
        </div>
        <div className="flex flex-auto flex-column">
          <div
            className={`t-small ${
              inverted ? 'c-on-base--inverted' : 'c-muted-2'
            }`}
          >
            {isPickup ? (
              <FormattedMessage
                id="store/user-address.pickup"
                values={{ name: friendlyName }}
              />
            ) : (
              <FormattedMessage id="store/user-address.order" />
            )}
          </div>
          <div className="truncate">{displayAddress}</div>
        </div>
      </div>
      {hasModal && (
        <Fragment>
          <div
            className={`bl bw1 mh4 ${inline ? 'nb2' : ''} ${
              inverted ? 'b--on-base--inverted' : 'b--muted-5'
            }`}
            style={{
              height: '1.5rem',
            }}
          />
          <div className="flex items-center">
            <ExtensionPoint
              id="modal"
              centered
              buttonLabel={intl.formatMessage({
                id: 'store/user-address.change',
              })}
              buttonClass={
                inverted ? 'c-on-base--inverted' : 'c-action-primary'
              }
              showTopBar={false}
            />
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default injectIntl(AddressInfo)
