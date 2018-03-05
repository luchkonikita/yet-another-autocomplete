"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONTROL_KEYS = {
    ArrowUp: true,
    ArrowDown: true,
    Enter: true,
    Escape: true,
    Tab: true
};
var Autocomplete = /** @class */ (function () {
    function Autocomplete(element, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.debounceTimeout = undefined;
        this.debounceTime = 100;
        this.results = [];
        this.resultsCache = {};
        this.selectedItemIndex = 0;
        this.destroyed = false;
        this.hide = function () {
            _this.container.style.display = 'none';
        };
        this.renderItem = function (item, index) {
            var selectedClass = index === _this.selectedItemIndex ? 'is-selected' : '';
            return "\n      <div class=\"autocomplete_box-item " + selectedClass + "\" data-value=\"" + item.value + "\" data-text=\"" + item.text + "\">\n        " + item.text + "\n      </div>\n    ";
        };
        // Data handling
        this.showResults = function () {
            var currentResults = _this.resultsCache[_this.input.value];
            if (currentResults && currentResults.length) {
                // Reset everything once new data arrives
                _this.selectedItemIndex = 0;
                _this.results = currentResults;
                _this.show();
            }
            else {
                _this.resetResults();
                _this.hide();
            }
        };
        this.resetResults = function () {
            _this.selectedItemIndex = 0;
            _this.results = [];
        };
        this.getResults = function (term) {
            if (!_this.options.query) {
                throw new Error('Autocomplete expects a "query" option to be supplied');
            }
            if (_this.resultsCache[term] && !_this.options.disableCaching) {
                _this.showResults();
            }
            else {
                _this.options.query(term, function (results) {
                    _this.resultsCache[term] = results;
                    _this.showResults();
                });
            }
        };
        // Events
        this.handleKeyup = function (event) {
            if (CONTROL_KEYS[event.key])
                return;
            if (_this.debounce())
                return;
            if (!_this.input.value) {
                _this.resetResults();
                _this.hide();
                return;
            }
            _this.getResults(_this.input.value);
        };
        this.handleKeydown = function (event) {
            if (!CONTROL_KEYS[event.key])
                return;
            if (event.key !== 'Tab')
                event.preventDefault();
            var lastIndex = _this.results.length - 1;
            var isLast = _this.selectedItemIndex === lastIndex;
            var isFirst = _this.selectedItemIndex === 0;
            switch (event.key) {
                case 'ArrowDown':
                    _this.selectedItemIndex = isLast ? 0 : _this.selectedItemIndex + 1;
                    _this.render();
                    break;
                case 'ArrowUp':
                    _this.selectedItemIndex = isFirst ? lastIndex : _this.selectedItemIndex - 1;
                    _this.render();
                    break;
                case 'Enter':
                    _this.handleSelect(_this.results[_this.selectedItemIndex]);
                    break;
                case 'Escape':
                case 'Tab':
                    _this.hide();
            }
        };
        this.handleClick = function (event) {
            var target = event.target;
            if (target.hasAttribute('data-value')) {
                var value = target.dataset.value;
                var text = target.dataset.text;
                if (!text || !value) {
                    throw new Error('Each option should have data-text and data-value attributes');
                }
                _this.handleSelect({ text: text, value: value });
            }
        };
        this.handleClickOutside = function (event) {
            if (event.target !== _this.input &&
                event.target !== _this.container &&
                !_this.container.contains(event.target)) {
                _this.hide();
            }
        };
        this.handleBlur = function (event) {
            // A workaround for iOS safari inputs switcher, which works as Tab keypress,
            // but does not trigger that event.
            setTimeout(function () {
                if (document.activeElement !== _this.input)
                    _this.hide();
            }, 500);
        };
        this.handleFocus = function (event) {
            _this.getResults(_this.input.value);
        };
        this.handleSelect = function (result) {
            if (_this.options.onSelect && result) {
                _this.options.onSelect(result);
                _this.input.value = result.text || '';
            }
            _this.hide();
        };
        this.handleResize = function () {
            _this.positionContainer();
        };
        this.input = element;
        this.options = options;
        this.container = this.initElement();
        this.input.addEventListener('keyup', this.handleKeyup);
        this.input.addEventListener('keydown', this.handleKeydown);
        this.input.addEventListener('focus', this.handleFocus);
        this.input.addEventListener('blur', this.handleBlur);
        this.container.addEventListener('click', this.handleClick);
        document.addEventListener('click', this.handleClickOutside);
        window.addEventListener('resize', this.handleResize);
    }
    Autocomplete.prototype.destroy = function () {
        if (this.destroyed)
            return;
        this.input.removeEventListener('keyup', this.handleKeyup);
        this.input.removeEventListener('keydown', this.handleKeydown);
        this.input.removeEventListener('focus', this.handleFocus);
        this.input.removeEventListener('blur', this.handleKeydown);
        document.removeEventListener('click', this.handleClickOutside);
        document.body.removeChild(this.container);
        window.removeEventListener('resize', this.handleResize);
        this.destroyed = true;
    };
    // Lifecycle
    Autocomplete.prototype.initElement = function () {
        var container = document.createElement('div');
        container.className = 'autocomplete_box';
        container.style.position = 'absolute';
        container.style.display = 'none';
        document.body.appendChild(container);
        return container;
    };
    Autocomplete.prototype.show = function () {
        this.render();
        this.positionContainer();
        this.container.style.display = 'block';
    };
    Autocomplete.prototype.render = function () {
        this.container.innerHTML = this.results.map(this.renderItem).join('\n');
    };
    // Rendering
    Autocomplete.prototype.positionContainer = function () {
        var elementRect = this.input.getBoundingClientRect();
        this.container.style.top = window.pageYOffset + elementRect.top + elementRect.height + 'px';
        this.container.style.left = elementRect.left + 'px';
        this.container.style.right = window.innerWidth - elementRect.right + 'px';
    };
    // Misc
    Autocomplete.prototype.debounce = function () {
        var _this = this;
        if (this.debounceTimeout)
            return true;
        this.debounceTimeout = setTimeout(function () {
            if (_this.debounceTimeout)
                clearTimeout(_this.debounceTimeout);
            _this.debounceTimeout = undefined;
        }, this.debounceTime);
        return false;
    };
    return Autocomplete;
}());
exports.default = Autocomplete;
