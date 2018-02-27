type QueryResult = {
  value: any,
  text: string
}
type QueryHandler = (term: string, resultsSetter: (results: QueryResult[]) => void) => void
type SelectHandler = (result: QueryResult) => any

interface IOptions {
  query?: QueryHandler,
  onSelect?: SelectHandler
}

const CONTROL_KEYS: { [index: string]: boolean } = {
  ArrowUp: true,
  ArrowDown: true,
  Enter: true,
  Escape: true,
  Tab: true
}

export default class Autocomplete {
  private input: HTMLInputElement
  private options: IOptions
  private container: HTMLDivElement

  private debounceTimeout?: number = undefined
  private debounceTime: number = 100

  private results: QueryResult[] = []
  private resultsCache: { [index: string]: QueryResult[] | undefined } = {}
  private selectedItemIndex: number = 0

  private destroyed: boolean = false

  constructor(element: HTMLInputElement, options: IOptions = {}) {
    this.input = element
    this.options = options
    this.container = this.initElement()

    this.input.addEventListener('keyup', this.handleKeyup)
    this.input.addEventListener('keydown', this.handleKeydown)
    this.input.addEventListener('focus', this.handleFocus)
    this.input.addEventListener('blur', this.handleBlur)
    this.container.addEventListener('click', this.handleClick)
    document.addEventListener('click', this.handleClickOutside)
    window.addEventListener('resize', this.handleResize)
  }

  public destroy() {
    if (this.destroyed) return
    this.input.removeEventListener('keyup', this.handleKeyup)
    this.input.removeEventListener('keydown', this.handleKeydown)
    this.input.removeEventListener('focus', this.handleFocus)
    this.input.removeEventListener('blur', this.handleKeydown)
    document.removeEventListener('click', this.handleClickOutside)
    document.body.removeChild(this.container)
    window.removeEventListener('resize', this.handleResize)
    this.destroyed = true
  }

  // Lifecycle
  private initElement(): HTMLDivElement {
    const container = document.createElement('div')
    container.className = 'autocomplete_box'
    container.style.position = 'absolute'
    container.style.display = 'none'
    document.body.appendChild(container)
    return container
  }

  private show() {
    this.render()
    this.positionContainer()
    this.container.style.display = 'block'
  }

  private render() {
    this.container.innerHTML = this.results.map(this.renderItem).join('\n')
  }

  private hide = () => {
    this.container.style.display = 'none'
  }

  // Rendering
  private positionContainer() {
    const elementRect = this.input.getBoundingClientRect()
    const elementHeight = parseInt(getComputedStyle(this.input).height || '0', 10)
    this.container.style.top = window.scrollY + elementRect.top + elementHeight + 'px'
    this.container.style.left = elementRect.left + 'px'
    this.container.style.right = window.innerWidth - elementRect.right + 'px'
  }

  private renderItem = (item: QueryResult, index: number): string => {
    const selectedClass = index === this.selectedItemIndex ? 'is-selected' : ''
    return `
      <div class="autocomplete_box-item ${selectedClass}" data-value="${item.value}" data-text="${item.text}">
        ${item.text}
      </div>
    `
  }

  // Data handling
  private showResults = () => {
    const currentResults = this.resultsCache[this.input.value]
    if (currentResults && currentResults.length) {
      // Reset everything once new data arrives
      this.selectedItemIndex = 0
      this.results = currentResults
      this.show()
    } else {
      this.resetResults()
      this.hide()
    }
  }

  private resetResults = () => {
    this.selectedItemIndex = 0
    this.results = []
  }

  private getResults = (term: string) => {
    if (!this.options.query) {
      throw new Error('Autocomplete expects a "query" option to be supplied')
    }

    if (this.resultsCache[term]) {
      this.showResults()
    } else {
      this.options.query(term, (results: QueryResult[]) => {
        this.resultsCache[term] = results
        this.showResults()
      })
    }
  }

  // Events
  private handleKeyup = (event: KeyboardEvent) => {
    if (CONTROL_KEYS[event.key]) return
    if (this.debounce()) return

    if (!this.input.value) {
      this.resetResults()
      this.hide()
      return
    }

    this.getResults(this.input.value)
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (!CONTROL_KEYS[event.key]) return
    if (event.key !== 'Tab') event.preventDefault()

    const lastIndex = this.results.length - 1
    const isLast = this.selectedItemIndex === lastIndex
    const isFirst = this.selectedItemIndex === 0

    switch (event.key) {
      case 'ArrowDown':
        this.selectedItemIndex = isLast ? 0 : this.selectedItemIndex + 1
        this.render()
        break
      case 'ArrowUp':
        this.selectedItemIndex = isFirst ? lastIndex : this.selectedItemIndex - 1
        this.render()
        break
      case 'Enter':
        this.handleSelect(this.results[this.selectedItemIndex])
        break
      case 'Escape':
      case 'Tab':
        this.hide()
    }
  }

  private handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.hasAttribute('data-value')) {
      const value = target.dataset.value
      const text = target.dataset.text
      if (!text || !value) {
        throw new Error('Each option should have data-text and data-value attributes')
      }
      this.handleSelect({ text, value })
    }
  }

  private handleClickOutside = (event: MouseEvent) => {
    if (
      event.target !== this.input &&
      event.target !== this.container &&
      !this.container.contains(event.target as Node)
    ) {
      this.hide()
    }
  }

  private handleBlur = (event: FocusEvent) => {
    // A workaround for iOS safari inputs switcher, which works as Tab keypress,
    // but does not trigger that event.
    setTimeout(() => {
      if (document.activeElement !== this.input) this.hide()
    }, 500)
  }

  private handleFocus = (event: FocusEvent) => {
    if (this.input.value) {
      this.getResults(this.input.value)
    }
  }

  private handleSelect = (result?: QueryResult) => {
    if (this.options.onSelect && result) {
      this.options.onSelect(result)
      this.input.value = result.text || ''
    }
    this.hide()
  }

  private handleResize = () => {
    if (this.debounce()) return
    this.positionContainer()
  }

  // Misc

  private debounce() {
    if (this.debounceTimeout) return true
    this.debounceTimeout = setTimeout(() => {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      this.debounceTimeout = undefined
    }, this.debounceTime)
    return false
  }
}
