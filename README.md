# Yet Another Autocomplete 🙅‍♂️

This is the simplest possible autocomplete implementation.
It handles just few things for you:
- draws the suggestions box
- allows keyboard navigation between items
- selects item by `Enter` or by clicking it
- closes the dialog on `Escape` keypress
- debounces input events a little bit

All the rest you can do on your own 😉

## Installation

```
yarn add yet-another-autocomplete
```

## Usage

```javascript
import Autocomplete from 'yet-another-autocomplete'

// Optionally require basic simple styles for the dialog.
// You can skip this step and just write your own styles in a way you like.
require('yet-another-autocomplete/style')

const items = ['Apple', 'Banana']

const autocomplete = new Autocomplete(this.el.querySelector('input[type="text"]'), {
  query: (term, setter) => {
    // Filter results based on `term`.
    // You can also do AJAX requests and set results asynchronously.
    // Call the `setter` with an array of `{text, value}` objects.
    const results = items
      .filter(i => i.text.toLowerCase().match(term.toLowerCase()))
      .map(result => ({text: result, value: result}))
    setter(results)
  },
  onSelect: (value) => {
    // You receive a selected result in the same `{text, value}` form.
    // Do something with the selected value here...
  }
})

// Destroy when not needed anymore.
// This will remove an autocomplete box from the DOM and unassign all related event listeners.

autocomplete.destroy()

```