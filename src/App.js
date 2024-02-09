import { useCallback, useEffect, useRef, useState } from 'react'
import { doBoundsCollide, getBoundsForNode, getXY } from './utils'
import './styles.css'

export default function App() {
  const [coordinates, setCoordinates] = useState(null)
  const [mouseDownData, setMouseDownData] = useState(null)
  const [isSelecting, setIsSelecting] = useState(false)

  const elementRef = useRef(null)

  const stopSelection = () => {
    setIsSelecting(false)
    setCoordinates(null)
  }

  const handleMouseMove = useCallback(
    (e) => {
      if (elementRef.current && mouseDownData) {
        setCoordinates(getXY(e, mouseDownData, elementRef.current))
      }
    },
    [mouseDownData]
  )

  const handleMouseDown = useCallback((e) => {
    const scrollBounds = elementRef.current.getBoundingClientRect()
    setMouseDownData({
      selectboxY: e.pageY - scrollBounds.top + elementRef.current.scrollTop,
      selectboxX: e.pageX - scrollBounds.left + elementRef.current.scrollLeft
    })

    setIsSelecting(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    stopSelection()

    if (elementRef.current && coordinates) {
      const items = Array.from(document.getElementsByClassName('card-element'))
      const [containerBounds] = getBoundsForNode(elementRef.current, {})

      items.forEach((item) => {
        const [cardBounds] = getBoundsForNode(item, {
          topGap: containerBounds.top,
          rightGap: containerBounds.right,
          bottomGap: containerBounds.bottom,
          leftGap: containerBounds.left
        })

        if (
          doBoundsCollide(
            {
              top: coordinates.y,
              left: coordinates.x,
              width: coordinates.width,
              height: coordinates.height
            },
            cardBounds
          )
        ) {
          console.log(item.getAttribute('item-id'))
        }
      })
    }
  }, [coordinates])

  useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', handleMouseMove)
    } else {
      stopSelection()
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove, isSelecting])

  return (
    <div
      className="App"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={stopSelection}
      ref={elementRef}
      style={{ height: '100vh' }}
    >
      {coordinates && isSelecting && (
        <div
          style={{
            zIndex: 9000,
            position: 'absolute',
            cursor: 'default',
            backgroundColor: '#429FE8',
            border: '2px solid #2B6D9C',
            opacity: 0.5,
            top: coordinates.y,
            left: coordinates.x,
            width: coordinates.width,
            height: coordinates.height
          }}
        />
      )}
      <div style={{ display: 'flex', gridAutoColumns: '1fr', height: '100%' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((column) => (
          <div
            key={`item-${column}`}
            style={{
              marginLeft: 8,
              width: '10%',
              height: '100%',
              background: 'grey',
              display: 'flex',
              flexDirection: 'column-reverse'
            }}
          >
            {[1, 2, 3].map((item) => {
              return (
                <div
                  key={`item-${column}-${item}`}
                  id={`item-${column}-${item}`}
                  item-id={`item-${column}-${item}`}
                  className="card-element"
                  style={{
                    padding: '8px 4px',
                    borderRadius: 8,
                    marginTop: 8,
                    backgroundColor: 'pink',
                    height: 50,
                    userSelect: 'none'
                  }}
                >
                  item-{column}-{item}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
