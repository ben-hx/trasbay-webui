'use strict';

/* Directives */

var app = angular.module('myApp.directives', []);


app.directive('checkImage', function ($http) {

    function setDefaultImageForElement(element) {
        element.attr('src', '../img/movie/movie-default-thumbnail.png');
    }

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('ngSrc', function (ngSrc) {
                if (!ngSrc) {
                    setDefaultImageForElement(element);
                    return;
                }
                $http.get(ngSrc).success(function () {
                }).error(function () {
                    setDefaultImageForElement(element);
                });

            });
        }
    };
});

app.directive("tagInput", function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, elem, attr) {
            var wrapper = angular.element(
                '<tags-input></tags-input>'
            );
            wrapper.addClass(elem.attr('class'));
            wrapper.attr('ng-model', elem.attr('ng-model'));
            wrapper.attr('placeholder', elem.attr('placeholder'));
            elem.before(wrapper);
            $compile(wrapper)(scope);
            wrapper.append(elem);
        }
    };
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
            wrapper.attr('titles', titles);
            elem.before(wrapper);
            $compile(wrapper)(scope);
            wrapper.append(elem);
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

            //Binding it to keyup, lly bind it to any other events of interest
            //like change etc..
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