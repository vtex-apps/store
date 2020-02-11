export function resolvePaginationDotsVisibility(visibility, isMobile) {
  return !!(
    visibility === 'visible' ||
    (visibility === 'mobileOnly' && isMobile) ||
    (visibility === 'desktopOnly' && !isMobile)
  )
}
