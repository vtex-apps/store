import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

export const LoginContainerProptypes = {
  /** Title of login options */
  optionsTitle: PropTypes.string,
  /** Title of classic login */
  emailAndPasswordTitle: PropTypes.string,
  /** Title of access code login */
  accessCodeTitle: PropTypes.string,
  /** Placeholder to email input */
  emailPlaceholder: PropTypes.string,
  /** Placeholder to password input */
  passwordPlaceholder: PropTypes.string,
  /** Placeholder to access code input */
  accessCodePlaceholder: PropTypes.string,
  /** Set the type of password verification ui */
  showPasswordVerificationIntoTooltip: PropTypes.bool,
  /** Icon's size */
  iconSize: PropTypes.number,
  /** Icon's label */
  iconLabel: PropTypes.string,
  /** Label's classnames */
  labelClasses: PropTypes.string,
  /** Determines if the icon profile will be hidden */
  showIconProfile: PropTypes.bool,
  /** Password login button text */
  providerPasswordButtonLabel: PropTypes.string,
  /** Whether the identifier extension values are enabled in the site editor */
  hasIdentifierExtension: PropTypes.bool,
  /** Placeholder for the identifier extension */
  identifierPlaceholder: PropTypes.string,
  /** Error message for the user identifier */
  invalidIdentifierError: PropTypes.string,
  /** Determines if the tooltip opens towards the right side */
  mirrorTooltipToRight: PropTypes.bool,
}

export const LoginPropTypes = {
  /** Intl object*/
  intl: intlShape,
  /** User profile information */
  profile: PropTypes.shape({}),
  /** Is box with the login options should be opened or not */
  isBoxOpen: PropTypes.bool.isRequired,
  /** Should the Icon be rendered as link or not */
  renderIconAsLink: PropTypes.bool.isRequired,
  /** Function called when the user click outside of the box*/
  onOutSideBoxClick: PropTypes.func.isRequired,
  /** Function called when the user clicks on the icon*/
  onProfileIconClick: PropTypes.func.isRequired,
  /** Runtime context. */
  runtime: PropTypes.shape({
    history: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string,
      }),
    }),
  }),
  /** Props received through the LoginContainer */
  ...LoginContainerProptypes,
}
