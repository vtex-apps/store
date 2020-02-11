import React, { Component } from 'react'
import classNames from 'classnames'
import useCssHandles from '../CssHandles/useCssHandles'

const CSS_HANDLES = ['itemContainer', 'itemContainerSelected', 'itemContainerUnselected', 'tabsContainer', 'tabsNamesContainer', 'shelfContainer', 'tabButton']

class Tabs extends Component {

  state = {
    selectedIndex: 0
  }

  handleClick = (index) => this.setState({ selectedIndex: index })

  render() {
    const { panes, cssHandles } = this.props
    const { selectedIndex } = this.state
    if (!panes || panes.length === 0) {
      return null
    }

    return (
      <div className="flex justify-center items-center">
      <div className={`${cssHandles.tabsContainer} flex-ns pa6-ns justify-between-ns w-100-s`}>
        <div className={`${cssHandles.tabsNamesContainer} flex flex-column mh6`}>
          {panes.map((pane, index) => {
            const isSelected = index === selectedIndex
            const isLast = index === panes.length - 1
            const itemContainer = classNames(`t-body pa4 tl bb b--muted-4 ${cssHandles.itemContainer}`, {
              [`bg-base--inverted c-on-muted-1 ${cssHandles.itemContainerSelected}`]: isSelected,
              [cssHandles.itemContainerUnselected]: !isSelected,
              'bw0': isLast,
            })
            return (
              <button 
                type="button"
                onClick={() => this.handleClick(index)}
                className={`${cssHandles.tabButton} bn outline-0 bg-transparent pa0`}
              >
                <div className={itemContainer} key={pane.menuItem} >{pane.menuItem}</div>
              </button>
            )
          })}
        </div>
        <div className={`${cssHandles.shelfContainer} mh6-s mw-100 overflow-hidden`}>
          {panes[selectedIndex].render()}
        </div>
      </div>
      </div>
    )
  }
}

export default withCssHandles(CSS_HANDLES)(Tabs)
