"use strict";
var _slicedToArray = function () {
    function sliceIterator(arr, i) {
        var _arr = [], _n = !0, _d = !1, _e = void 0;
        try {
            for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
        } catch (err) {
            _d = !0, _e = err
        } finally {
            try {
                !_n && _i["return"] && _i["return"]()
            } finally {
                if (_d)throw _e
            }
        }
        return _arr
    }

    return function (arr, i) {
        if (Array.isArray(arr))return arr;
        if (Symbol.iterator in Object(arr))return sliceIterator(arr, i);
        throw new TypeError("Invalid attempt to destructure non-iterable instance")
    }
}();
angular.module("ui.mention", []).directive("uiMention", function () {
    return {
        require: ["ngModel", "uiMention"],
        controller: "uiMention",
        controllerAs: "$mention",
        link: function ($scope, $element, $attrs, _ref) {
            var _ref2 = _slicedToArray(_ref, 2), ngModel = _ref2[0], uiMention = _ref2[1];
            uiMention.init(ngModel)
        }
    }
}), angular.module("ui.mention").controller("uiMention", ["$element", "$scope", "$attrs", "$q", "$timeout", "$document", function ($element, $scope, $attrs, $q, $timeout, $document) {
    function parseContentAsText(content) {
        try {
            return temp.textContent = content, temp.innerHTML
        } finally {
            temp.textContent = null
        }
    }

    var _this2 = this;
    this.delimiter = "@", this.searchPattern = this.pattern || new RegExp("(?:\\s+|^)" + this.delimiter + "(\\w+(?: \\w+)?)$"), this.decodePattern = new RegExp(this.delimiter + "[[\\s\\w]+:[0-9a-z-]+]", "gi"), this.$element = $element, this.choices = [], this.mentions = [];
    var ngModel;
    this.init = function (model) {
        var _this = this;
        $attrs.ngTrim = "false", ngModel = model, ngModel.$parsers.push(function (value) {
            return _this.mentions = _this.mentions.filter(function (mention) {
                if (~value.indexOf(_this.label(mention)))return value = value.replace(_this.label(mention), _this.encode(mention))
            }), _this.render(value), value
        }), ngModel.$formatters.push(function () {
            var value = arguments.length <= 0 || void 0 === arguments[0] ? "" : arguments[0];
            return value = value.toString(), _this.mentions = _this.mentions.filter(function (mention) {
                return !!~value.indexOf(_this.encode(mention)) && (value = value.replace(_this.encode(mention), _this.label(mention)), !0)
            }), value
        }), ngModel.$render = function () {
            $element.val(ngModel.$viewValue || ""), $timeout(_this.autogrow, !0), _this.render()
        }
    };
    var temp = document.createElement("span");
    this.render = function () {
        var html = arguments.length <= 0 || void 0 === arguments[0] ? ngModel.$modelValue : arguments[0];
        return html = (html || "").toString(), html = parseContentAsText(html), _this2.mentions.forEach(function (mention) {
            html = html.replace(_this2.encode(mention), _this2.highlight(mention))
        }), _this2.renderElement().html(html), html
    }, this.renderElement = function () {
        return $element.next()
    }, this.highlight = function (choice) {
        return "<span>" + this.label(choice) + "</span>"
    }, this.decode = function () {
        var value = arguments.length <= 0 || void 0 === arguments[0] ? ngModel.$modelValue : arguments[0];
        return value ? value.replace(this.decodePattern, "$1") : ""
    }, this.label = function (choice) {
        return choice.firstName + " " + choice.lastName
    }, this.encode = function (choice) {
        return "<a href='javascript:' class='mention' ng-click='profileView("+choice.id+")'>" + this.delimiter + this.label(choice) +"</a>"
    }, this.replace = function (mention) {
        var search = arguments.length <= 1 || void 0 === arguments[1] ? this.searching : arguments[1], text = arguments.length <= 2 || void 0 === arguments[2] ? ngModel.$viewValue : arguments[2];
        return text = text.substr(0, search.index + search[0].indexOf(this.delimiter)) + this.label(mention) + " " + text.substr(search.index + search[0].length)
    }, this.select = function () {
        var choice = arguments.length <= 0 || void 0 === arguments[0] ? this.activeChoice : arguments[0];
        return !!choice && (this.mentions.push(choice), ngModel.$setViewValue(this.replace(choice)), this.cancel(), void ngModel.$render())
    }, this.up = function () {
        var index = this.choices.indexOf(this.activeChoice);
        index > 0 ? this.activeChoice = this.choices[index - 1] : this.activeChoice = this.choices[this.choices.length - 1]
    }, this.down = function () {
        var index = this.choices.indexOf(this.activeChoice);
        index < this.choices.length - 1 ? this.activeChoice = this.choices[index + 1] : this.activeChoice = this.choices[0]
    }, this.search = function (match) {
        var _this3 = this;
        return this.searching = match, $q.when(this.findChoices(match, this.mentions)).then(function (choices) {
            return _this3.choices = choices, _this3.activeChoice = choices[0], choices
        })
    }, this.findChoices = function (match, mentions) {
        return []
    }, this.cancel = function () {
        this.choices = [], this.searching = null
    }, this.autogrow = function () {
        //$element[0].style.height = 0;
        //var style = getComputedStyle($element[0]);
        //"border-box" == style.boxSizing && ($element[0].style.height = $element[0].scrollHeight + "px")
    }, $element.on("keyup click focus", function (event) {
        if (_this2.moved)return _this2.moved = !1;
        if ($element[0].selectionStart == $element[0].selectionEnd) {
            var text = $element.val(), match = _this2.searchPattern.exec(text.substr(0, $element[0].selectionStart));
            match ? _this2.search(match) : _this2.cancel(), $scope.$$phase || $scope.$apply()
        }
    }), $element.on("keydown", function (event) {
        if (_this2.searching) {
            switch (event.keyCode) {
                case 13:
                    _this2.select();
                    break;
                case 38:
                    _this2.up();
                    break;
                case 40:
                    _this2.down();
                    break;
                default:
                    return
            }
            _this2.moved = !0, event.preventDefault(), $scope.$$phase || $scope.$apply()
        }
    }), this.onMouseup = function (event) {
        var _this4 = this;
        event.target != $element[0] && ($document.off("mouseup", this.onMouseup), this.searching && $scope.$evalAsync(function () {
            _this4.cancel()
        }))
    }.bind(this), $element.on("focus", function (event) {
        $document.on("mouseup", _this2.onMouseup)
    }), $element.on("input", this.autogrow), $timeout(this.autogrow, !0)
}]);