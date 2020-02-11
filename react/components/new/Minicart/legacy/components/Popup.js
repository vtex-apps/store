import React from 'react'
import PropTypes from 'prop-types'
import Overlay from '../../../ReactPortal/Overlay'

import minicart from '../minicart.css'

const boxPositionStyle = {
  right: -40,
}

/**
 * Pop-up component.
 */
const Popup = ({ children, onOutsideClick }) => {
  return (
    <Overlay>
      <div
        className="fixed top-0 left-0 w-100 h-100"
        onClick={onOutsideClick}
      />
      <div
        className={`${minicart.box} dn db-ns absolute z-max flex flex-colunm`}
        style={boxPositionStyle}
      >
        <div className={`${minicart.popupContentContainer} shadow-3`}>
          <div
            className={`${minicart.arrowUp} absolute top-0 shadow-3 bg-base h1 w1 pa4 rotate-45`}
          />
          <div
            className={`${minicart.popupChildrenContainer} mt3 bg-base relative flex flex-column`}
          >
            {children}
          </div>
        </div>
      </div>
    </Overlay>
  )
}

Popup.propTypes = {
  /* The pop-up's content */
  children: PropTypes.object,
  /* Offset width to set the arrow position */
  buttonOffsetWidth: PropTypes.number,
  /* Function to be called when click occurs outside the popup */
  onOutsideClick: PropTypes.func,
}

export default Popup
