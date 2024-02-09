export function getXY(e, mouseDownData, container) {
  // TO-DO: implement the distance between
  // top of page and top of container
  const { pageX, pageY } = e
  const scrollBounds = container.getBoundingClientRect()

  const pointY = pageY - scrollBounds.top + container.scrollTop
  const selectboxY = Math.min(pointY, mouseDownData.selectboxY)

  const pointX = pageX - scrollBounds.left + container.scrollLeft
  const selectboxX = Math.min(pointX, mouseDownData.selectboxX)

  return {
    x: selectboxX,
    y: selectboxY,
    width: Math.abs(pointX - mouseDownData.selectboxX),
    height: Math.abs(pointY - mouseDownData.selectboxY)
  }
}

export function getBoundsForNode(
  node,
  { topGap = 0, rightGap = 0, bottomGap = 0, leftGap = 0 }
) {
  const { scrollTop, scrollLeft } = node

  return Array.from(node.getClientRects()).map((rect) => ({
    top: rect.top + scrollTop - topGap,
    left: rect.left + scrollLeft - leftGap,
    bottom: rect.bottom + scrollTop - bottomGap,
    right: rect.right + scrollLeft - rightGap,
    offsetWidth: node.offsetWidth,
    offsetHeight: node.offsetHeight,
    width: rect.width,
    height: rect.height
  }))
}

export function doBoundsCollide(a, b, tolerance = 0) {
  return !(
    a.top + a.height - tolerance < b.top || // 'a' top doesn't touch 'b' top
    // 'a' top doesn't touch 'b' bottom
    a.top + tolerance > b.top + b.height ||
    // 'a' right doesn't touch 'b' left
    a.left + a.width - tolerance < b.left ||
    // 'a' left doesn't touch 'b' right
    a.left + tolerance > b.left + b.width
  )
}
