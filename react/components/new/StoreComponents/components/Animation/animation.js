const DRAWER_HORIZONTAL = 'drawerHorizontal'
const DRAWER_VERTICAL = 'drawerVertical'

export const DRAWER_ANIMATION = {
  [DRAWER_HORIZONTAL]: (duration, transfer) => ({
    transform: `translateX(${transfer}%)`,
    transition: `transform ${duration}s ease-in-out`,
  }),
  [DRAWER_VERTICAL]: (duration, transfer) => ({
    transform: `translateY(${transfer}%)`,
    transition: `transform ${duration}s ease-in-out`,
  }),
}

export const ANIMATIONS = {
  drawerLeft: {
    from: (duration, transfer) =>
      DRAWER_ANIMATION[DRAWER_HORIZONTAL](duration, -transfer),
    leave: (duration, transfer) =>
      DRAWER_ANIMATION[DRAWER_HORIZONTAL](duration, transfer),
  },
  drawerRight: {
    from: (duration, transfer) =>
      DRAWER_ANIMATION[DRAWER_HORIZONTAL](duration, transfer),
    leave: (duration, transfer) =>
      DRAWER_ANIMATION[DRAWER_HORIZONTAL](duration, -transfer),
  },
  drawerTop: {
    from: (duration, transfer) =>
      DRAWER_ANIMATION[DRAWER_VERTICAL](duration, -transfer),
    leave: (duration, transfer) =>
      DRAWER_ANIMATION[DRAWER_VERTICAL](duration, transfer),
  },
  drawerBottom: {
    from: (duration, transfer) =>
      DRAWER_ANIMATION[DRAWER_VERTICAL](duration, transfer),
    leave: (duration, transfer) =>
      DRAWER_ANIMATION[DRAWER_VERTICAL](duration, -transfer),
  },
}
