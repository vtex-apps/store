import React, { useState, useEffect, useMemo } from 'react'
import { graphql } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import IconGlobe from '../StoreIcons/IconGlobe'
import Locales from './queries/locales.gql'
import useCssHandles from '../CssHandles/useCssHandles'
import { path } from 'ramda'

const CSS_HANDLES = ['container', 'button', 'buttonText', 'list', 'listElement']

function getLabel(localeId) {
  return localeId.split('-')[0]
}

function getSupportedLanguages(data) {
  if (data.loading || data.error) {
    return []
  }

  const supportedLanguages = path(['currentBinding', 'supportedLocales'], data) || path(['languages', 'supported'], data) || []
  
  return supportedLanguages.reduce((acc, lang) => {
    if (!lang.includes('-')) {
      return acc
    }

    return acc.concat({
      text: getLabel(lang),
      localeId: lang
    })
  }, [])
}

const getLocale = (supportedLangs, locale) => {
  const localeObj = supportedLangs.find(
    ({ localeId }) => getLabel(localeId) === getLabel(locale)
  )
  return localeObj || supportedLangs && supportedLangs[0]
}

const LocaleSwitcher = ({ data }) => {
  const supportedLangs = useMemo(() => getSupportedLanguages(data), [data])
  const { culture, emitter } = useRuntime()
  const [openLocaleSelector, setOpenLocaleSelector] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState(() => getLocale(supportedLangs, culture && culture.locale))
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    const newSelectedLocale = getLocale(supportedLangs, culture.locale)

    if (newSelectedLocale !== selectedLocale) {
      setSelectedLocale(selectedLocale)
    }
  }, [supportedLangs, culture.locale])

  const handleLocaleClick = id => {
    emitter.emit('localesChanged', id)
    setOpenLocaleSelector(false)
    setSelectedLocale(getLocale(supportedLangs, id))
  }

  const handleMouseDown = e => {
    e.preventDefault()
  }

  if (supportedLangs.length === 0 || !selectedLocale) {
    return null
  }

  const containerClasses = `${handles.container} w3 flex items-center justify-end ml2 mr3 relative`
  const buttonClasses = `${handles.button} link pa0 bg-transparent bn flex items-center pointer mr3 c-on-base`
  const buttonTextClasses = `${handles.buttonText} pl2 t-action--small order-1`
  const listClasses = `${handles.list} absolute z-5 list top-1 w3 ph0 mh0 mv4 bg-base`
  const listElementClasses = `${handles.listElement} t-action--small pointer f5 pa3 hover-bg-muted-5 tc`

  return (
    <div className={containerClasses}>
      <button
        className={buttonClasses}
        onBlur={() => setOpenLocaleSelector(false)}
        onClick={() => setOpenLocaleSelector(!openLocaleSelector)}
      >
        <IconGlobe />
        <span className={buttonTextClasses}>{selectedLocale.text}</span>
      </button>
      <ul
        hidden={!openLocaleSelector}
        className={listClasses}
      >
        {supportedLangs
        .filter(({ localeId }) => localeId !== selectedLocale.localeId)
        .map(({ localeId, text }) => (
          <li
            key={localeId}
            onMouseDown={handleMouseDown}
            className={listElementClasses}
            onClick={() => handleLocaleClick(localeId)}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default graphql(Locales)(LocaleSwitcher)
