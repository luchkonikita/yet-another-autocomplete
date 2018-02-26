import Autocomplete from '../index'

let input: HTMLInputElement
let autocomplete: Autocomplete
let autocompleteContainer: HTMLElement

const options = [
  'Austria',
  'Australia',
  'Andorra',
  'Angola',
  'Congo',
  'Iceland'
]

let onSelect
let query

const keyboardEvent = (type, key) => new KeyboardEvent(type, { key })

beforeEach(() => {
  onSelect = jest.fn()
  query = jest.fn((term, setter) => {
    const results = options
      .filter(option => option.toLowerCase().match(term.toLowerCase()))
      .map(option => ({ text: option, value: option }))
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

  expect(onSelect.mock.calls[0][0]).toEqual({ text: 'Andorra', value: 'Andorra' })
  expect(input.value).toBe('Andorra')
  expect(autocompleteContainer.style.display).toBe('none')
})

test('on keyboard navigation with Escape', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))
  input.dispatchEvent(keyboardEvent('keydown', 'Escape'))

  expect(autocompleteContainer.style.display).toBe('none')
})

test('on item click', () => {
  input.value = 'an'
  input.dispatchEvent(keyboardEvent('keyup', 'n'))

  const clickEvent = new MouseEvent('click', { bubbles: true })
  const option = autocompleteContainer.querySelector('[data-value="Andorra"]') as HTMLElement
  option.dispatchEvent(clickEvent)

  expect(onSelect.mock.calls[0][0]).toEqual({ text: 'Andorra', value: 'Andorra' })
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
