/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import WrapperContainer from '../components/WrapperContainer'

describe('WrapperContainer', () => {
  it('should render children inside the container structure', () => {
    const { getByText, container } = render(
      <WrapperContainer>
        <div>Test Child</div>
      </WrapperContainer>
    )

    expect(getByText('Test Child')).toBeInTheDocument()

    // Check the container structure
    const outerDiv = container.firstChild
    expect(outerDiv.tagName).toBe('DIV')
    
    const innerDiv = outerDiv.firstChild
    expect(innerDiv.tagName).toBe('DIV')
    expect(innerDiv).toHaveClass('flex', 'flex-column', 'min-vh-100', 'w-100')
  })

  it('should apply className prop to outer container', () => {
    const testClassName = 'custom-wrapper-class'
    const { container } = render(
      <WrapperContainer className={testClassName}>
        <div>Test Child</div>
      </WrapperContainer>
    )

    const outerDiv = container.firstChild
    expect(outerDiv).toHaveClass(testClassName)
  })

  it('should render without className prop', () => {
    const { container, getByText } = render(
      <WrapperContainer>
        <div>Test Child</div>
      </WrapperContainer>
    )

    expect(getByText('Test Child')).toBeInTheDocument()
    
    const outerDiv = container.firstChild
    expect(outerDiv.tagName).toBe('DIV')
    expect(outerDiv.className).toBe('')
  })

  it('should handle multiple children', () => {
    const { getByText } = render(
      <WrapperContainer>
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </WrapperContainer>
    )

    expect(getByText('First Child')).toBeInTheDocument()
    expect(getByText('Second Child')).toBeInTheDocument()
    expect(getByText('Third Child')).toBeInTheDocument()
  })

  it('should render with no children', () => {
    const { container } = render(
      <WrapperContainer className="empty-container" />
    )

    const outerDiv = container.firstChild
    expect(outerDiv).toHaveClass('empty-container')
    
    const innerDiv = outerDiv.firstChild
    expect(innerDiv).toHaveClass('flex', 'flex-column', 'min-vh-100', 'w-100')
    expect(innerDiv.children).toHaveLength(0)
  })

  it('should maintain proper CSS classes on inner div', () => {
    const { container } = render(
      <WrapperContainer>
        <div>Content</div>
      </WrapperContainer>
    )

    const innerDiv = container.querySelector('.flex.flex-column.min-vh-100.w-100')
    expect(innerDiv).toBeInTheDocument()
    expect(innerDiv).toHaveClass('flex')
    expect(innerDiv).toHaveClass('flex-column')
    expect(innerDiv).toHaveClass('min-vh-100')
    expect(innerDiv).toHaveClass('w-100')
  })

  it('should handle complex nested children', () => {
    const { getByTestId } = render(
      <WrapperContainer className="test-wrapper">
        <header data-testid="header">Header</header>
        <main data-testid="main">
          <section>
            <h1>Title</h1>
            <p>Content</p>
          </section>
        </main>
        <footer data-testid="footer">Footer</footer>
      </WrapperContainer>
    )

    expect(getByTestId('header')).toBeInTheDocument()
    expect(getByTestId('main')).toBeInTheDocument()
    expect(getByTestId('footer')).toBeInTheDocument()
  })

  it('should be a functional component that returns JSX', () => {
    // Test that the component is indeed a function and returns JSX
    expect(typeof WrapperContainer).toBe('function')
    
    const result = WrapperContainer({ 
      children: React.createElement('div', null, 'test'), 
      className: 'test' 
    })
    
    expect(React.isValidElement(result)).toBe(true)
  })

  it('should handle undefined className gracefully', () => {
    const { container } = render(
      <WrapperContainer className={undefined}>
        <div>Test</div>
      </WrapperContainer>
    )

    const outerDiv = container.firstChild
    expect(outerDiv.className).toBe('')
  })

  it('should handle null children', () => {
    const { container } = render(
      <WrapperContainer>
        {null}
      </WrapperContainer>
    )

    const innerDiv = container.querySelector('.flex.flex-column.min-vh-100.w-100')
    expect(innerDiv).toBeInTheDocument()
    expect(innerDiv.children).toHaveLength(0)
  })

  it('should handle boolean children (filtered out by React)', () => {
    const { container, getByText } = render(
      <WrapperContainer>
        {true}
        <div>Visible Child</div>
        {false}
      </WrapperContainer>
    )

    expect(getByText('Visible Child')).toBeInTheDocument()
    
    const innerDiv = container.querySelector('.flex.flex-column.min-vh-100.w-100')
    expect(innerDiv.children).toHaveLength(1) // Only the div should be rendered
  })
})
