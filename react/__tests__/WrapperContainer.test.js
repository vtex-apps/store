/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import WrapperContainer from '../components/WrapperContainer'

describe('WrapperContainer component', () => {
  it('should render children with correct wrapper structure', () => {
    const { getByTestId, container } = render(
      <WrapperContainer>
        <div data-testid="child">Test Child</div>
      </WrapperContainer>
    )

    expect(getByTestId('child')).toBeInTheDocument()
    const innerDiv = container.firstChild.firstChild
    expect(innerDiv).toHaveClass('flex', 'flex-column', 'min-vh-100', 'w-100')
  })

  it('should apply custom className when provided', () => {
    const { container } = render(
      <WrapperContainer className="custom-wrapper">
        <div>Test Child</div>
      </WrapperContainer>
    )

    expect(container.firstChild).toHaveClass('custom-wrapper')
  })

  it('should render with default structure when no className provided', () => {
    const { container } = render(
      <WrapperContainer>
        <div>Test Child</div>
      </WrapperContainer>
    )

    // Should have outer div without className
    expect(container.firstChild).not.toHaveAttribute('class')
    
    // Should have inner div with layout classes
    const innerDiv = container.firstChild.firstChild
    expect(innerDiv).toHaveClass('flex', 'flex-column', 'min-vh-100', 'w-100')
  })

  it('should handle multiple children correctly', () => {
    const { getByTestId } = render(
      <WrapperContainer>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </WrapperContainer>
    )

    expect(getByTestId('child1')).toBeInTheDocument()
    expect(getByTestId('child2')).toBeInTheDocument()
    expect(getByTestId('child3')).toBeInTheDocument()
  })

  it('should apply correct CSS classes for layout', () => {
    const { container } = render(
      <WrapperContainer className="test-class">
        <div>Content</div>
      </WrapperContainer>
    )

    const outerDiv = container.firstChild
    const innerDiv = outerDiv.firstChild

    expect(outerDiv).toHaveClass('test-class')
    expect(innerDiv).toHaveClass('flex')
    expect(innerDiv).toHaveClass('flex-column')
    expect(innerDiv).toHaveClass('min-vh-100')
    expect(innerDiv).toHaveClass('w-100')
  })

  it('should handle empty children', () => {
    const { container } = render(
      <WrapperContainer>
        {null}
      </WrapperContainer>
    )

    const innerDiv = container.firstChild.firstChild
    expect(innerDiv).toBeInTheDocument()
    expect(innerDiv).toHaveClass('flex', 'flex-column', 'min-vh-100', 'w-100')
  })

  it('should handle undefined className gracefully', () => {
    const { container } = render(
      <WrapperContainer className={undefined}>
        <div>Test</div>
      </WrapperContainer>
    )

    expect(container.firstChild).not.toHaveAttribute('class')
  })

  it('should maintain proper DOM structure', () => {
    const { container } = render(
      <WrapperContainer className="outer">
        <header>Header</header>
        <main>Main Content</main>
        <footer>Footer</footer>
      </WrapperContainer>
    )

    // Check structure: outer div > inner div > children
    const outerDiv = container.firstChild
    const innerDiv = outerDiv.firstChild
    
    expect(outerDiv.tagName).toBe('DIV')
    expect(innerDiv.tagName).toBe('DIV')
    expect(innerDiv.children).toHaveLength(3)
    expect(innerDiv.children[0].tagName).toBe('HEADER')
    expect(innerDiv.children[1].tagName).toBe('MAIN')
    expect(innerDiv.children[2].tagName).toBe('FOOTER')
  })
})