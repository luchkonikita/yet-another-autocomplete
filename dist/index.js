"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONTROL_KEYS = {
    ArrowUp: true,
    ArrowDown: true,
    Enter: true,
    Escape: true
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
                _this.hide();
            }
        };
        this.getResults = function (term) {
            if (!_this.options.query) {
                throw new Error('Autocomplete expects a "query" option to be supplied');
            }
            if (_this.resultsCache[term]) {
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
            if (_this.debounceTimeout)
                return;
            _this.debounceTimeout = setTimeout(function () {
                if (_this.debounceTimeout)
                    clearTimeout(_this.debounceTimeout);
                _this.debounceTimeout = undefined;
            }, _this.debounceTime);
            if (!_this.input.value) {
                _this.hide();
                return;
            }
            _this.getResults(_this.input.value);
        };
        this.handleKeydown = function (event) {
            if (!CONTROL_KEYS[event.key])
                return;
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
        this.handleSelect = function (result) {
            _this.options.onSelect
                ? _this.options.onSelect(result)
                : console.warn('Autocomplete expects an "onSelect" option to be supplied');
            _this.input.value = result.value || '';
            _this.hide();
        };
        this.input = element;
        this.options = options;
        this.input.addEventListener('keyup', this.handleKeyup);
        this.input.addEventListener('keydown', this.handleKeydown);
        this.container = this.initElement();
        this.container.addEventListener('click', this.handleClick);
        document.addEventListener('click', this.handleClickOutside);
    }
    Autocomplete.prototype.destroy = function () {
        if (this.destroyed)
            return;
        this.input.removeEventListener('keyup', this.handleKeyup);
        this.input.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('click', this.handleClickOutside);
        document.body.removeChild(this.container);
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
        var elementHeight = parseInt(getComputedStyle(this.input).height || '0', 10);
        this.container.style.top = window.scrollY + elementRect.top + elementHeight + 'px';
        this.container.style.left = elementRect.left + 'px';
        this.container.style.right = window.innerWidth - elementRect.right + 'px';
    };
    return Autocomplete;
}());
exports.default = Autocomplete;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFZQSxJQUFNLFlBQVksR0FBaUM7SUFDakQsT0FBTyxFQUFFLElBQUk7SUFDYixTQUFTLEVBQUUsSUFBSTtJQUNmLEtBQUssRUFBRSxJQUFJO0lBQ1gsTUFBTSxFQUFFLElBQUk7Q0FDYixDQUFBO0FBRUQ7SUFjRSxzQkFBWSxPQUF5QixFQUFFLE9BQXNCO1FBQXRCLHdCQUFBLEVBQUEsWUFBc0I7UUFBN0QsaUJBVUM7UUFuQk8sb0JBQWUsR0FBWSxTQUFTLENBQUE7UUFDcEMsaUJBQVksR0FBVyxHQUFHLENBQUE7UUFFMUIsWUFBTyxHQUFrQixFQUFFLENBQUE7UUFDM0IsaUJBQVksR0FBbUQsRUFBRSxDQUFBO1FBQ2pFLHNCQUFpQixHQUFXLENBQUMsQ0FBQTtRQUU3QixjQUFTLEdBQVksS0FBSyxDQUFBO1FBMkMxQixTQUFJLEdBQUc7WUFDYixLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO1FBQ3ZDLENBQUMsQ0FBQTtRQVdPLGVBQVUsR0FBRyxVQUFDLElBQWlCLEVBQUUsS0FBYTtZQUNwRCxJQUFNLGFBQWEsR0FBRyxLQUFLLEtBQUssS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtZQUMzRSxNQUFNLENBQUMsZ0RBQytCLGFBQWEsd0JBQWlCLElBQUksQ0FBQyxLQUFLLHVCQUFnQixJQUFJLENBQUMsSUFBSSxxQkFDakcsSUFBSSxDQUFDLElBQUkseUJBRWQsQ0FBQTtRQUNILENBQUMsQ0FBQTtRQUVELGdCQUFnQjtRQUNSLGdCQUFXLEdBQUc7WUFDcEIsSUFBTSxjQUFjLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzFELEVBQUUsQ0FB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QUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDekUsQ0FBQztJQU1ELFlBQVk7SUFDSix3Q0FBaUIsR0FBekI7UUFDRSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLENBQUE7UUFDdEQsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzlFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQTtRQUNsRixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7SUFDM0UsQ0FBQztJQStHSCxtQkFBQztBQUFELENBQUMsQUFqTEQsSUFpTEMiLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIFF1ZXJ5UmVzdWx0ID0ge1xuICB2YWx1ZTogYW55LFxuICB0ZXh0OiBzdHJpbmdcbn1cbnR5cGUgUXVlcnlIYW5kbGVyID0gKHRlcm06IHN0cmluZywgcmVzdWx0c1NldHRlcjogKHJlc3VsdHM6IFF1ZXJ5UmVzdWx0W10pID0+IHZvaWQpID0+IHZvaWRcbnR5cGUgU2VsZWN0SGFuZGxlciA9IChyZXN1bHQ6IFF1ZXJ5UmVzdWx0KSA9PiBhbnlcblxuaW50ZXJmYWNlIElPcHRpb25zIHtcbiAgcXVlcnk/OiBRdWVyeUhhbmRsZXIsXG4gIG9uU2VsZWN0PzogU2VsZWN0SGFuZGxlclxufVxuXG5jb25zdCBDT05UUk9MX0tFWVM6IHsgW2luZGV4OiBzdHJpbmddOiBib29sZWFuIH0gPSB7XG4gIEFycm93VXA6IHRydWUsXG4gIEFycm93RG93bjogdHJ1ZSxcbiAgRW50ZXI6IHRydWUsXG4gIEVzY2FwZTogdHJ1ZVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvY29tcGxldGUge1xuICBwcml2YXRlIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50XG4gIHByaXZhdGUgb3B0aW9uczogSU9wdGlvbnNcbiAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG5cbiAgcHJpdmF0ZSBkZWJvdW5jZVRpbWVvdXQ/OiBudW1iZXIgPSB1bmRlZmluZWRcbiAgcHJpdmF0ZSBkZWJvdW5jZVRpbWU6IG51bWJlciA9IDEwMFxuXG4gIHByaXZhdGUgcmVzdWx0czogUXVlcnlSZXN1bHRbXSA9IFtdXG4gIHByaXZhdGUgcmVzdWx0c0NhY2hlOiB7IFtpbmRleDogc3RyaW5nXTogUXVlcnlSZXN1bHRbXSB8IHVuZGVmaW5lZCB9ID0ge31cbiAgcHJpdmF0ZSBzZWxlY3RlZEl0ZW1JbmRleDogbnVtYmVyID0gMFxuXG4gIHByaXZhdGUgZGVzdHJveWVkOiBib29sZWFuID0gZmFsc2VcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50LCBvcHRpb25zOiBJT3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5pbnB1dCA9IGVsZW1lbnRcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5dXApXG4gICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlkb3duKVxuXG4gICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmluaXRFbGVtZW50KClcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2tPdXRzaWRlKVxuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSByZXR1cm5cbiAgICB0aGlzLmlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXl1cClcbiAgICB0aGlzLmlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrT3V0c2lkZSlcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuY29udGFpbmVyKVxuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxuICB9XG5cbiAgLy8gTGlmZWN5Y2xlXG4gIHByaXZhdGUgaW5pdEVsZW1lbnQoKTogSFRNTERpdkVsZW1lbnQge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdhdXRvY29tcGxldGVfYm94J1xuICAgIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICBjb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxuICAgIHJldHVybiBjb250YWluZXJcbiAgfVxuXG4gIHByaXZhdGUgc2hvdygpIHtcbiAgICB0aGlzLnJlbmRlcigpXG4gICAgdGhpcy5wb3NpdGlvbkNvbnRhaW5lcigpXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyKCkge1xuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IHRoaXMucmVzdWx0cy5tYXAodGhpcy5yZW5kZXJJdGVtKS5qb2luKCdcXG4nKVxuICB9XG5cbiAgcHJpdmF0ZSBoaWRlID0gKCkgPT4ge1xuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgfVxuXG4gIC8vIFJlbmRlcmluZ1xuICBwcml2YXRlIHBvc2l0aW9uQ29udGFpbmVyKCkge1xuICAgIGNvbnN0IGVsZW1lbnRSZWN0ID0gdGhpcy5pbnB1dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IGVsZW1lbnRIZWlnaHQgPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKHRoaXMuaW5wdXQpLmhlaWdodCB8fCAnMCcsIDEwKVxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHdpbmRvdy5zY3JvbGxZICsgZWxlbWVudFJlY3QudG9wICsgZWxlbWVudEhlaWdodCArICdweCdcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gZWxlbWVudFJlY3QubGVmdCArICdweCdcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5yaWdodCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZWxlbWVudFJlY3QucmlnaHQgKyAncHgnXG4gIH1cblxuICBwcml2YXRlIHJlbmRlckl0ZW0gPSAoaXRlbTogUXVlcnlSZXN1bHQsIGluZGV4OiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IHNlbGVjdGVkQ2xhc3MgPSBpbmRleCA9PT0gdGhpcy5zZWxlY3RlZEl0ZW1JbmRleCA/ICdpcy1zZWxlY3RlZCcgOiAnJ1xuICAgIHJldHVybiBgXG4gICAgICA8ZGl2IGNsYXNzPVwiYXV0b2NvbXBsZXRlX2JveC1pdGVtICR7c2VsZWN0ZWRDbGFzc31cIiBkYXRhLXZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiIGRhdGEtdGV4dD1cIiR7aXRlbS50ZXh0fVwiPlxuICAgICAgICAke2l0ZW0udGV4dH1cbiAgICAgIDwvZGl2PlxuICAgIGBcbiAgfVxuXG4gIC8vIERhdGEgaGFuZGxpbmdcbiAgcHJpdmF0ZSBzaG93UmVzdWx0cyA9ICgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50UmVzdWx0cyA9IHRoaXMucmVzdWx0c0NhY2hlW3RoaXMuaW5wdXQudmFsdWVdXG4gICAgaWYgKGN1cnJlbnRSZXN1bHRzICYmIGN1cnJlbnRSZXN1bHRzLmxlbmd0aCkge1xuICAgICAgLy8gUmVzZXQgZXZlcnl0aGluZyBvbmNlIG5ldyBkYXRhIGFycml2ZXNcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtSW5kZXggPSAwXG4gICAgICB0aGlzLnJlc3VsdHMgPSBjdXJyZW50UmVzdWx0c1xuICAgICAgdGhpcy5zaG93KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oaWRlKClcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFJlc3VsdHMgPSAodGVybTogc3RyaW5nKSA9PiB7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXV0b2NvbXBsZXRlIGV4cGVjdHMgYSBcInF1ZXJ5XCIgb3B0aW9uIHRvIGJlIHN1cHBsaWVkJylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXN1bHRzQ2FjaGVbdGVybV0pIHtcbiAgICAgIHRoaXMuc2hvd1Jlc3VsdHMoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMucXVlcnkodGVybSwgKHJlc3VsdHM6IFF1ZXJ5UmVzdWx0W10pID0+IHtcbiAgICAgICAgdGhpcy5yZXN1bHRzQ2FjaGVbdGVybV0gPSByZXN1bHRzXG4gICAgICAgIHRoaXMuc2hvd1Jlc3VsdHMoKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvLyBFdmVudHNcbiAgcHJpdmF0ZSBoYW5kbGVLZXl1cCA9IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChDT05UUk9MX0tFWVNbZXZlbnQua2V5XSkgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5kZWJvdW5jZVRpbWVvdXQpIHJldHVyblxuICAgIHRoaXMuZGVib3VuY2VUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5kZWJvdW5jZVRpbWVvdXQpIGNsZWFyVGltZW91dCh0aGlzLmRlYm91bmNlVGltZW91dClcbiAgICAgIHRoaXMuZGVib3VuY2VUaW1lb3V0ID0gdW5kZWZpbmVkXG4gICAgfSwgdGhpcy5kZWJvdW5jZVRpbWUpXG5cbiAgICBpZiAoIXRoaXMuaW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmdldFJlc3VsdHModGhpcy5pbnB1dC52YWx1ZSlcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlS2V5ZG93biA9IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmICghQ09OVFJPTF9LRVlTW2V2ZW50LmtleV0pIHJldHVyblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGNvbnN0IGxhc3RJbmRleCA9IHRoaXMucmVzdWx0cy5sZW5ndGggLSAxXG4gICAgY29uc3QgaXNMYXN0ID0gdGhpcy5zZWxlY3RlZEl0ZW1JbmRleCA9PT0gbGFzdEluZGV4XG4gICAgY29uc3QgaXNGaXJzdCA9IHRoaXMuc2VsZWN0ZWRJdGVtSW5kZXggPT09IDBcblxuICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbUluZGV4ID0gaXNMYXN0ID8gMCA6IHRoaXMuc2VsZWN0ZWRJdGVtSW5kZXggKyAxXG4gICAgICAgIHRoaXMucmVuZGVyKClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbUluZGV4ID0gaXNGaXJzdCA/IGxhc3RJbmRleCA6IHRoaXMuc2VsZWN0ZWRJdGVtSW5kZXggLSAxXG4gICAgICAgIHRoaXMucmVuZGVyKClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgdGhpcy5oYW5kbGVTZWxlY3QodGhpcy5yZXN1bHRzW3RoaXMuc2VsZWN0ZWRJdGVtSW5kZXhdKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnRXNjYXBlJzpcbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG4gICAgaWYgKHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSkge1xuICAgICAgY29uc3QgdmFsdWUgPSB0YXJnZXQuZGF0YXNldC52YWx1ZVxuICAgICAgY29uc3QgdGV4dCA9IHRhcmdldC5kYXRhc2V0LnRleHRcbiAgICAgIGlmICghdGV4dCB8fCAhdmFsdWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFYWNoIG9wdGlvbiBzaG91bGQgaGF2ZSBkYXRhLXRleHQgYW5kIGRhdGEtdmFsdWUgYXR0cmlidXRlcycpXG4gICAgICB9XG4gICAgICB0aGlzLmhhbmRsZVNlbGVjdCh7IHRleHQsIHZhbHVlIH0pXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVDbGlja091dHNpZGUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoXG4gICAgICBldmVudC50YXJnZXQgIT09IHRoaXMuaW5wdXQgJiZcbiAgICAgIGV2ZW50LnRhcmdldCAhPT0gdGhpcy5jb250YWluZXIgJiZcbiAgICAgICF0aGlzLmNvbnRhaW5lci5jb250YWlucyhldmVudC50YXJnZXQgYXMgTm9kZSlcbiAgICApIHtcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVTZWxlY3QgPSAocmVzdWx0OiBRdWVyeVJlc3VsdCkgPT4ge1xuICAgIHRoaXMub3B0aW9ucy5vblNlbGVjdFxuICAgICAgPyB0aGlzLm9wdGlvbnMub25TZWxlY3QocmVzdWx0KVxuICAgICAgOiBjb25zb2xlLndhcm4oJ0F1dG9jb21wbGV0ZSBleHBlY3RzIGFuIFwib25TZWxlY3RcIiBvcHRpb24gdG8gYmUgc3VwcGxpZWQnKVxuICAgIHRoaXMuaW5wdXQudmFsdWUgPSByZXN1bHQudmFsdWUgfHwgJydcbiAgICB0aGlzLmhpZGUoKVxuICB9XG59XG4iXX0=