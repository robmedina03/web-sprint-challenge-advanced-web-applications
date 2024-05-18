// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner"
import { render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import React from "react"


test('sanity', () => {
  expect(true).toBe(false)
})

test('does not render when the "on" prop is false', () =>{
  const {container} = render(<Spinner on={false} />);
  expect(container).toBeEmptyDOMElement();
});

test('renders correctly when the "on" is true', () => {
  render(<Spinner on={true} />)
  expect(screen.getByText('Please wait...')).toBeInTheDocument();
})

test('has correct structure when rendered', () => {
  const {container} = render(<Spinner on={true} />);
  const spinner = container.querySelector('#spinner');
  expect(spinner).toBeInTheDocument()
  expect(spinner).toContainHTML('<h3>&nbsp;.</h3>&nbsp;&nbsp;&nbsp;Please wait...')
});
