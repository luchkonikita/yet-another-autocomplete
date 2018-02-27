import Autocomplete from '../index'

let input: HTMLInputElement
let autocomplete: Autocomplete
let autocompleteContainer: HTMLElement

const options = [
  { text: 'Austria', value: '1' },
  { text: 'Australia', value: '2' },
  { text: 'Andorra', value: '3' },
  { text: 'Angola', value: '4' },
  { text: 'Congo', value: '5' },
  { text: 'Iceland', value: '6' }
]

let onSelect
let query

const keyboardEvent = (type, key) => new KeyboardEvent(type, { key })

beforeEach(() => {
  onSelect = jest.fn()
  query = jest.fn((term, setter) => {
    const results = options
      .filter(option => option.text.toLowerCase().match(term.toLowerCase()))
    setter(results)
  })
  input = document.createElement('input')
  input.type = 'text'
  document.body.appendChild(input)
  autocomplete = new Autocomplete(input, { query, onSelect })
  autocompleteContainer = document.querySelector('.autocomplete_box') as HTMLElement
})

afterEach(() => {
  autocomplete.destroy()
  document.body.removeChild(input)
})

test('initialization', () => {
  expect(autocompleteContainer.outerHTML).toMatchSnapshot()
})

test('on input', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  expect(autocompleteContainer.outerHTML).toMatchSnapshot()
})

test('on keyboard navigation with ArrowDown', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  input.dispatchEvent(keyboardEvent('keydown', 'ArrowDown'))
  expect(autocompleteContainer.outerHTML).toMatchSnapshot()
  input.dispatchEvent(keyboardEvent('keydown', 'ArrowDown'))
  expect(autocompleteContainer.outerHTML).toMatchSnapshot()
  input.dispatchEvent(keyboardEvent('keydown', 'ArrowDown'))
  expect(autocompleteContainer.outerHTML).toMatchSnapshot()
})

test('on keyboard navigation with ArrowUp', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  input.dispatchEvent(keyboardEvent('keydown', 'ArrowUp'))
  expect(autocompleteContainer.outerHTML).toMatchSnapshot()
})

test('on keyboard navigation with Enter', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  input.dispatchEvent(keyboardEvent('keydown', 'Enter'))

  expect(onSelect.mock.calls[0][0]).toEqual({ text: 'Andorra', value: '3' })
  expect(input.value).toBe('Andorra')
  expect(autocompleteContainer.style.display).toBe('none')
})

test('on keyboard navigation with Escape', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  input.dispatchEvent(keyboardEvent('keydown', 'Escape'))

  expect(autocompleteContainer.style.display).toBe('none')
})

test('on keyboard navigation with Tab', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  input.dispatchEvent(keyboardEvent('keydown', 'Tab'))

  expect(autocompleteContainer.style.display).toBe('none')
})

test('on blur', done => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  expect(autocompleteContainer.style.display).toBe('block')

  input.dispatchEvent(new Event('blur'))
  expect(autocompleteContainer.style.display).toBe('block')

  setTimeout(() => {
    expect(autocompleteContainer.style.display).toBe('none')
    done()
  }, 550)
})

test('on blur when focused back within a timeout', done => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  expect(autocompleteContainer.style.display).toBe('block')

  input.dispatchEvent(new Event('blur'))
  expect(autocompleteContainer.style.display).toBe('block')

  input.focus()

  setTimeout(() => {
    expect(autocompleteContainer.style.display).toBe('block')
    done()
  }, 550)
})

test('on focus', () => {
  input.value = 'an'
  input.dispatchEvent(new Event('focus'))

  expect(autocompleteContainer.outerHTML).toMatchSnapshot()
})

test('on item click', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))

  const clickEvent = new MouseEvent('click', { bubbles: true })
  const option = autocompleteContainer.querySelector('[data-value="3"]') as HTMLElement
  option.dispatchEvent(clickEvent)

  expect(onSelect.mock.calls[0][0]).toEqual({ text: 'Andorra', value: '3' })
  expect(input.value).toBe('Andorra')
  expect(autocompleteContainer.style.display).toBe('none')
})

test('on click outside', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))

  const clickEvent = new MouseEvent('click', { bubbles: true })
  document.body.dispatchEvent(clickEvent)

  expect(input.value).toBe('an')
  expect(autocompleteContainer.style.display).toBe('none')
})

test('debouncing', done => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  input.value = 'ang'
  input.dispatchEvent(keyboardEvent('keyup', 'g'))

  setTimeout(() => {
    input.value = 'ango'
    input.dispatchEvent(keyboardEvent('keyup', 'o'))
    expect(query.mock.calls).toHaveLength(2)
    done()
  }, 110)
})

test('memoization', done => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))

  setTimeout(() => {
    input.value = 'an'
    input.dispatchEvent(keyboardEvent('keyup', 'n'))
    expect(query.mock.calls).toHaveLength(1)
    done()
  }, 110)
})

test('destroy', () => {
  autocomplete.destroy()

  autocompleteContainer = document.querySelector('.autocomplete_box') as HTMLElement
  expect(autocompleteContainer).toBeNull()
})
