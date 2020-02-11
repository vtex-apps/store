import PropTypes from 'prop-types'

export const lean = {
  propTypes: {
    /** If it is leanMode or not */
    leanMode: PropTypes.bool,
  },
  defaultProps: {
    leanMode: false,
  },
}

export const logo = {
  propTypes: {
    /** Address opened when the user clicks the logo */
    linkUrl: PropTypes.string,
    /** URL of the logo image */
    logoUrl: PropTypes.string,
    /** Alt text for the logo */
    logoTitle: PropTypes.string,
    /** Size of the logo */
    logoSize: PropTypes.shape({
      /** Size on desktop */
      desktop: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
      }),
      /** Size on mobile */
      mobile: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
      }),
    }),
  },
  defaultProps: {
    linkUrl: '/',
    logoUrl: '',
    logoSize: {
      desktop: {
        width: 132,
        height: 40,
      },
      mobile: {
        width: 90,
        height: 40,
      },
    },
  },
}

export const searchBar = {
  propTypes: {
    /** Sets whether the search bar is visible or not */
    showSearchBar: PropTypes.bool,
  },
  defaultProps: {
    showSearchBar: true,
  },
}

export const login = {
  propTypes: {
    /** Sets whether the login button is displayed or not*/
    showLogin: PropTypes.bool,
  },
  defaultProps: {
    showLogin: true,
  },
}

export const icons = {
  propTypes: {
    /** Classes for icons */
    iconClasses: PropTypes.string,
    /** Classes for labels */
    labelClasses: PropTypes.string,
  },
  defaultProps: {
    iconClasses: 'c-on-base',
    labelClasses: 'c-on-base',
  },
}

export const collapsible = {
  propTypes: {
    collapsibleAnimation: PropTypes.shape({
      /** If should animate on scroll */
      onScroll: PropTypes.bool,
      /** If should animate on every scroll up or  down */
      always: PropTypes.bool,
      /** Scroll value that animation starts to be active */
      anchor: PropTypes.number,
      /** Initial height */
      from: PropTypes.number,
      /** Target height */
      to: PropTypes.number,
      /** Animation configuration presets: know more @ https://www.react-spring.io/docs/hooks/api */
      preset: PropTypes.oneOf([
        'default',
        'gentle',
        'wobbly',
        'stiff',
        'slow',
        'molasses',
      ]),
      /** Animation configuration: know more @ https://www.react-spring.io/docs/hooks/api */
      config: PropTypes.shape({
        mass: PropTypes.number,
        tension: PropTypes.number,
        friction: PropTypes.number,
        clamp: PropTypes.bool,
        precision: PropTypes.number,
        velocity: PropTypes.number,
        duration: PropTypes.number,
        easing: PropTypes.func,
      }),
    }),
  },

  defaultProps: {
    collapsibleAnimation: {
      onScroll: true,
      always: true,
      anchor: 100,
      from: 4,
      to: 0,
      preset: 'default',
      config: {},
    },
  },
}

export const spacer = {
  propTypes: {
    /** Height on mobile mode */
    spacerHeightMobile: PropTypes.number,
    /** Height on desktop mode */
    spacerHeightDesktop: PropTypes.number,
    /** Width on mobile and desktop */
    spacerWidth: PropTypes.number,
  },

  defaultProps: {
    spacerHeightMobile: 96,
    spacerHeightDesktop: 160,
    spacerWidth: 0,
  },
}
