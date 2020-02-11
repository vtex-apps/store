/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'
import RichText from '../index'

import { textPositionValues, textAlignmentValues } from '../typings/SchemaTypes'

describe('Rich text component', () => {
  const defaultProps = {
    font: 't-body',
    text: '',
    textPosition: textPositionValues.LEFT,
    textAlignment: textAlignmentValues.LEFT,
    textColor: 'c-on-base',
  }

  it('should render with bold', () => {
    const component = render(
      <RichText {...defaultProps} text={'**be bold**'} />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render with paragraph', () => {
    const component = render(
      <RichText {...defaultProps} text={'IAM BOLD'} />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render link with title', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={
          '[I\'m an inline-style link with title](https://www.google.com "Google\'s Homepage")\n**Bollllddd**\n*this is talic*'
        }
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render and sanitize malicious text', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={
          "Hi everyone! This is **how** you do XSS <script>alert('XSS')</script>"
        }
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render and sanitize malicious text', () => {
    const component = render(
      <RichText {...defaultProps} text={'[some text](javascript:exec())'} />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render and sanitize malicious javascript', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={'<a href="javascript:exec()">HEHEHE</a>'}
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render and sanitize malicious javascript', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={
          '<DIV STYLE="background-image: url(&#1;javascript:alert(\'XSS\'))">'
        }
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render with image', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={
          `Inline-style: 
          ![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")`
        }
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render with image no title', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={
          `Inline-style: 
          ![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)`
        }
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render with image block class props', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={
          `[I\'m an inline-style link with title](https://www.google.com "Google\'s Homepage")\n**Bollllddd**\n*this is talic*`
        }
        blockClass="home"
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render an iframe', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={ // It must be preceeded by Markdown tag or any other string, otherwise the lib marked escapes the iframe HTML tag.
          "__<iframe frameborder=\"0\" height=\"100%\" src=\"https://invictastores.typeform.com/to/KmycOT?typeform-embed=embed-widget&amp;embed-hide-footer=true&amp;embed-hide-headers=true&amp;embed-opacity=50&amp;typeform-embed-id=d0pe3\" width=\"100%\" style=\"border: 0px;\"></iframe>__"
        }
      />
    )

    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render a link with target', () => {
    const { asFragment } = render(
      <RichText
        {...defaultProps}
        text="<a href='https://google.com' target='_blank'>bc</a>"
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render a link with target as query string on markdown and erase ?', () => {
    const { asFragment } = render(
      <RichText
        {...defaultProps}
        text="[text](https://www.google.com?target=_blank)  "
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render a link with target as query string on markdown and keep others params', () => {
    const { asFragment } = render(
      <RichText
        {...defaultProps}
        text="[text](https://www.google.com?target=_blank&foo=tree\&bar=lala)"
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render a link with target as query string on markdown and keep others params, remove trailing &', () => {
    const { asFragment } = render(
      <RichText
        {...defaultProps}
        text="[text](https://www.google.com?foo=tree\&bar=lala&target=_blank)"
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render a table', () => {
    const { asFragment } = render(
      <RichText
        {...defaultProps}
        text={`
foo|bar
---|---
teste|abc
        `}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with two different heading levels', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={
          `# Heading 1 # \n ### Heading level 3 ##`
        }
        blockClass="home"
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should render list', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={
          `Teste \n * Item 1\n * Item 2\n * Item 3`
        }
        blockClass="home"
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })


  it('should render ordered list', () => {
    const component = render(
      <RichText
        {...defaultProps}
        text={
          `Teste \n 1. Item 1\n 2. Item 2\n 3. Item 3`
        }
        blockClass="home"
      />
    )
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should sanitize the font prop', () => {
    const typography = 't-heading-1'
    const { container } = render(<RichText {...defaultProps} text="foo" font={`${typography} foo`} />)

    const element = container.querySelector(`.${typography}`)
    const notFound = container.querySelector('.foo')

    expect(element).toBeTruthy()
    expect(notFound).toBeFalsy()
  })

  it('should sanitize the textColor prop', () => {
    const color = 'c-muted-1'
    const { container } = render(<RichText {...defaultProps} text="foo" textColor={`${color} foo`} />)

    const element = container.querySelector(`.${color}`)
    const notFound = container.querySelector('.foo')

    expect(element).toBeTruthy()
    expect(notFound).toBeFalsy()
  })

  it('should allow tel scheme on link', () => {
    const component = render(<RichText {...defaultProps} text="[Telefone](tel:+18882165252)" />)
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should allow mailto scheme on link', () => {
    const component = render(<RichText {...defaultProps} text="[Mail me](mailto:test@vtex.com.br)" />)
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })
})

