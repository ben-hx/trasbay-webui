'use strict';

var app = angular.module('myApp.directives', []);

app.directive('checkImage', function ($http, $compile) {

    var defaultImageUrl = '/trashbay/webui/app/img/movie/movie-default-thumbnail.png';

    return {
        restrict: 'A',
        scope: {
            spinner: '@'
        },
        link: function (scope, element, attrs) {

            scope.createSpinnerForElement = function (element) {
                return angular.element("<img name='spinner' class='" + element.attr('class') + " fa-spin' src='" + defaultImageUrl + "'>");
            };

            scope.setDefaultImageForElement = function (element) {
                element.attr('src', defaultImageUrl);
            };

            scope.ngSrc = attrs.ngSrc;
            scope.element = element;
            scope.spinner = scope.createSpinnerForElement(element);
            scope.spinner.insertAfter(element);

            attrs.$observe('ngSrc', function (ngSrc) {
                if (ngSrc) {
                    scope.element.hide();
                } else {
                    scope.setDefaultImageForElement(scope.element);
                    scope.showElements();
                }
            });

            scope.element.bind('load', function () {
                scope.showElements();
            });
            scope.element.bind('error', function () {
                scope.setDefaultImageForElement(scope.element);
                scope.showElements();
            });

            scope.showElements = function () {
                scope.spinner.remove();
                scope.element.show();
            };
        }
    };
});

app.directive('loadingImage', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            ngModel: '=',
            alt: '@',
            class: '@',
            placeholder: '@'
        },
        templateUrl: 'directives/loading-image.html',
        link: function (scope, elem, attrs, ngModel) {
            scope.$watch('data', function () {
                if (scope.data) {
                    ngModel.$setViewValue(scope.data);
                    ngModel.$render();
                }
            });
        },
        controller: ['$scope', function ($scope) {

            $scope.checkDefaultValue = function () {
                $scope.data = $scope.data || [];
            };

            $scope.onChange = function (value, isChecked) {
                $scope.checkDefaultValue();
                if (isChecked) {
                    $scope.data.push(value);
                } else {
                    var index = $scope.data.indexOf(value);
                    if (index > -1) {
                        $scope.data.splice(index, 1);
                    }
                }
            }
        }]
    };
});


app.directive("tagInput", function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            tagClass: '@',
            placeholder: '@'
        },
        template: '<span><input id="tagsinput" type="text"/></span>',
        link: function (scope, elem, attr, ngModel) {
            scope.tagClass = scope.tagClass || 'label label-default';
            scope.placeholder = scope.placeholder || '';
            elem.children().first().tagsinput({tagClass: scope.tagClass});
            var input = elem.find('input');
            input.attr('placeholder', scope.placeholder);

            var tagsinput = elem.find('#tagsinput');
            tagsinput.on('itemAdded', function (event) {
                updateModel();
            });
            tagsinput.on('itemRemoved', function (event) {
                updateModel();
            });

            ngModel.$render = function () {
                var newValue = ngModel.$viewValue;
                tagsinput.tagsinput('removeAll');
                if (newValue) {
                    angular.forEach(newValue, function (value, key) {
                        tagsinput.tagsinput('add', value);
                    });
                }
            };

            var updateModel = function () {
                ngModel.$setViewValue(tagsinput.tagsinput('items'));
            };
        }
    }

});

app.directive("rankingStars", function ($compile, config) {
    //var titles = '["' + config.movieOptions.rankingTitles.join("", "") + "]'";
    var titles = "['one','two','three']";
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, elem, attr) {
            var wrapper = angular.element(
                '<span uib-rating max="10"></span>'
            );
            wrapper.addClass(elem.attr('class'));
            wrapper.attr('ng-model', elem.attr('ng-model'));
            wrapper.attr('ng-click', elem.attr('ng-click'));
            wrapper.attr('read-only', elem.attr('read-only'));
            wrapper.attr('on-leave', elem.attr('on-leave'));
            wrapper.attr('on-hover', elem.attr('on-hover'));
            wrapper.attr('titles', titles);
            elem.before(wrapper);
            $compile(wrapper)(scope);
            wrapper.append(elem);
        }
    };
});

app.directive('checklist', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            ngModel: '=',
            onChange: '&'
        },
        templateUrl: 'directives/checklist.html'

    };
});

app.directive('editableImage', function () {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            ngModel: '=',
            alt: '@',
            class: '@',
            placeholder: '@'
        },
        templateUrl: 'directives/editable-image.html'
    };
});

app.directive('movieDatabaseInput', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            data: '=ngModel',
            placeholder: '@',
            isLoading: '='
        },
        templateUrl: 'directives/movie-database-input.html',
        link: function (scope, elem, attrs, ngModel) {
            scope.$watch('data', function () {
                if (scope.data) {
                    ngModel.$setViewValue(scope.data);
                    ngModel.$render();
                }
            });

            scope.$watch('typeaheadIsOpen', function (newVal, oldVal) {
                if (newVal == oldVal) {
                    return;
                }
                if (newVal) {
                    var searchField = elem.find('input');
                    var width = searchField[0].offsetWidth;
                    var dropdown = elem.find('.dropdown-menu');
                    angular.element(dropdown[0]).css('width', (width + 'px'));
                }
            });
        },
        controller: ['$scope', 'MovieDatabaseRepository', function ($scope, MovieDatabaseRepository) {
            $scope.getTitles = function (searchText) {
                return MovieDatabaseRepository.getShortMoviesByText(searchText).then(function (shortMovies) {
                    return shortMovies;
                });
            };

            $scope.titleOnSelect = function (shortMovie, movieFromMovieDatabase) {
                $scope.data = movieFromMovieDatabase;
                return MovieDatabaseRepository.getByImdbId(shortMovie.imdbId).then(function (movie) {
                    $scope.data = movie;
                });
            };
        }]
    };
});

app.directive('stringChecklist', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            data: '=ngModel',
            values: '='
        },
        templateUrl: 'directives/string-checklist.html',
        link: function (scope, elem, attrs, ngModel) {
            scope.$watch('data', function () {
                if (scope.data) {
                    ngModel.$setViewValue(scope.data);
                    ngModel.$render();
                }
            });
        },
        controller: ['$scope', function ($scope) {

            $scope.checkDefaultValue = function () {
                $scope.data = $scope.data || [];
            };

            $scope.onChange = function (value, isChecked) {
                $scope.checkDefaultValue();
                if (isChecked) {
                    $scope.data.push(value);
                } else {
                    var index = $scope.data.indexOf(value);
                    if (index > -1) {
                        $scope.data.splice(index, 1);
                    }
                }
            }
        }]
    };
});

app.directive('sidebar', function ($document) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            isOpen: '=',
            wrapperElementId: '@'
        },
        link: function (scope, elem, attrs) {
            scope.sidebarWrapperElement = $document.find(scope.wrapperElementId);
            scope.$watch('isOpen', function (newVal) {
                if (newVal) {
                    scope.sidebarWrapperElement.addClass('toggled');
                    return;
                }
                scope.sidebarWrapperElement.removeClass('toggled');
            });
        }
    };
});

app.directive('numberInput', function ($parse, $filter) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            data: '=ngModel',
            isOpen: '=',
            onChange: '&',
            min: '@',
            max: '@',
            step: '@',
            placeholder: '@'
        },
        templateUrl: 'directives/number-input.html',
        link: function (scope, elem, attrs, ngModel) {
            scope.$watch('data', function () {
                if (scope.data) {
                    ngModel.$setViewValue(parseFloat(scope.data));
                    ngModel.$render();
                }
            });
            scope.min = parseFloat($parse(attrs.min)(scope)) || 0;
            scope.max = parseFloat($parse(attrs.max)(scope)) || 10;
            scope.step = parseFloat($parse(attrs.step)(scope)) || 1;
        },
        controller: ['$scope', function ($scope) {

            $scope.init = function () {
                $scope.step = parseFloat($scope.step) || 1;
            };

            $scope.checkDefaultValue = function () {
                $scope.data = $scope.data || 0;
            };

            $scope.checkEnabledStates = function () {
                $scope.subDisabled = $scope.data == $scope.min;
                $scope.addDisabled = $scope.data == $scope.max;
            };

            $scope.add = function () {
                $scope.checkDefaultValue();
                if ($scope.data < $scope.max) {
                    $scope.data = parseFloat($scope.data) + parseFloat($scope.step)
                }
                $scope.checkEnabledStates();
            };

            $scope.sub = function () {
                $scope.checkDefaultValue();
                if ($scope.data > $scope.min) {
                    $scope.data = parseFloat($scope.data) - parseFloat($scope.step);
                }
                $scope.checkEnabledStates();
            };
        }]
    };
});

app.directive('yearInput', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            ngModel: '=',
            inputClass: '@',
            btnClass: '@',
            placeholder: '@',
            popupPlacement: '@'
        },
        templateUrl: 'directives/year-input.html',
        link: function (scope, elem, attrs, ngModel) {
            scope.inputClass = scope.inputClass || 'form-control';
            scope.btnClass = scope.btnClass || 'btn btn-default';
            scope.popupPlacement = scope.popupPlacement || 'auto bottom-left';

            var modelToView = function (value) {
                if (value) {
                    scope.data = new Date(value, 1, 1);
                } else {
                    scope.data = undefined;
                }
            };

            var viewToModel = function (value) {
                if (scope.rerender) {
                    if (value instanceof Date) {
                        ngModel.$setViewValue(value.getFullYear());
                    } else {
                        ngModel.$setViewValue(value);
                    }
                }
            };

            scope.onInputChange = function () {
                scope.rerender = true;
                viewToModel(scope.data);
            };

            ngModel.$render = function () {
                scope.rerender = false;
                modelToView(ngModel.$viewValue);
            }
        }
    };
});


app.directive('dateInput', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            ngModel: '=',
            inputClass: '@',
            btnClass: '@',
            placeholder: '@',
            popupPlacement: '@'
        },
        templateUrl: 'directives/date-input.html',
        link: function (scope, elem, attrs, ngModel) {
            scope.inputClass = scope.inputClass || 'form-control';
            scope.btnClass = scope.btnClass || 'btn btn-default';
            scope.popupPlacement = scope.popupPlacement || 'auto bottom-left';

            ngModel.$formatters.push(function toModel(date) {
                if (date) {
                    date = date;
                }
            });

            scope.$watch('data', function () {
                ngModel.$setViewValue(scope.data);
                ngModel.$render();
            });
        }
    };
});

/**
 * directive to validate passwords in the html-view
 *
 * @directive passwordInput
 */
app.directive('passwordInput', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.passwordInput;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);

/**
 * directive to submit on enter-click in textareas
 *
 * @directive ngEnter
 */
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown", function (e) {
            if (e.which === 13 && !e.ctrlKey) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {'e': e});
                });
                e.preventDefault();
            }
            else if (e.which === 13 && e.ctrlKey) {
                this.value = this.value + "\n";
            }
        });
    };
});

/**
 * directive to open the datepicker
 *
 * @directive dateclick
 */
app.directive("dateclick", function () {
    return {
        link: function ($scope, element, attrs) {
            $scope.dateIsOpen = false;

            $scope.openCalendar = function (event) {
                event.preventDefault();
                event.stopPropagation();
                $scope.dateIsOpen = !$scope.dateIsOpen;
            };
        }
    }
});

/**
 * directive to open a dropdown-menu without
 * changing the route (href-directive)
 *
 * @directive dropdownclick
 */
app.directive("dropdownNoRouteChange", function () {
    return {
        link: function ($scope, element, attrs) {
            $scope.dropDownIsOpen = false;

            $scope.openDropDown = function (event) {
                $scope.dropDownIsOpen = !$scope.dropDownIsOpen;
            };
        }
    }
});

app.directive('focus', function ($timeout) {
    return {
        scope: {trigger: '@focus'},
        link: function (scope, element) {
            scope.$watch('trigger', function (value) {
                if (value === "true") {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
});

app.directive('focusOnShow', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            debugger;
            if ($attr.ngShow) {
                $scope.$watch($attr.ngShow, function (newValue) {
                    if (newValue) {
                        $timeout(function () {
                            $element[0].focus();
                        }, 0);
                    }
                })
            }
            if ($attr.ngHide) {
                $scope.$watch($attr.ngHide, function (newValue) {
                    if (!newValue) {
                        $timeout(function () {
                            $element[0].focus();
                        }, 0);
                    }
                })
            }

        }
    };
})

app.directive('focusOnSetVisible', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            if ($attr.ngStyle) {
                $scope.$watch($attr.ngStyle, function (newValue) {
                    if (newValue.visibility && newValue.visibility == 'visible') {
                        $timeout(function () {
                            $element[0].focus();
                        }, 0);
                    }
                })
            }
        }
    };
});

app.directive('contenteditable', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elm, attr, ngModel) {

            function updateViewValue() {
                ngModel.$setViewValue(this.innerHTML);
            }

            elm.on('keyup', updateViewValue);

            scope.$on('$destroy', function () {
                elm.off('keyup', updateViewValue);
            });

            ngModel.$render = function () {
                elm.html(ngModel.$viewValue);
            }
        }
    }
});

app.directive('switchButton', [
    function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.bootstrapSwitch();

                element.on('switchChange.bootstrapSwitch', function (event, state) {
                    if (ngModel) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(state);
                        });
                    }
                });

                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if (newValue) {
                        element.bootstrapSwitch('state', true, true);
                    } else {
                        element.bootstrapSwitch('state', false, true);
                    }
                });
            }
        };
    }
]);