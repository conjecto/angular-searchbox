/**
 * angular-strap
 * @version v2.0.5 - 2014-08-07
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.helpers.parseOptions",[]).provider("$parseOptions",function(){var n=this.defaults={regexp:/^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/};this.$get=["$parse","$q",function(s,r){function e(e,t){function a(n,s){return n.map(function(n,r){var e,t,a={};return a[c]=n,e=o(s,a),t=f(s,a)||r,{label:e,value:t}})}var u={},i=angular.extend({},n,t);u.$values=[];var $,o,c,l,p,f,v;return u.init=function(){u.$match=$=e.match(i.regexp),o=s($[2]||$[1]),c=$[4]||$[6],l=$[5],p=s($[3]||""),f=s($[2]?$[1]:c),v=s($[7])},u.valuesFn=function(n,s){return r.when(v(n,s)).then(function(s){return u.$values=s?a(s,n):{},u.$values})},u.init(),u}return e}]});
//# sourceMappingURL=parse-options.min.js.map
/**
 * angular-strap
 * @version v2.0.5 - 2014-08-07
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.helpers.dimensions",[]).factory("dimensions",["$document","$window",function(){var t=(angular.element,{}),e=t.nodeName=function(t,e){return t.nodeName&&t.nodeName.toLowerCase()===e.toLowerCase()};t.css=function(t,e,o){var n;return n=t.currentStyle?t.currentStyle[e]:window.getComputedStyle?window.getComputedStyle(t)[e]:t.style[e],o===!0?parseFloat(n)||0:n},t.offset=function(t){var e=t.getBoundingClientRect(),o=t.ownerDocument;return{width:e.width||t.offsetWidth,height:e.height||t.offsetHeight,top:e.top+(window.pageYOffset||o.documentElement.scrollTop)-(o.documentElement.clientTop||0),left:e.left+(window.pageXOffset||o.documentElement.scrollLeft)-(o.documentElement.clientLeft||0)}},t.position=function(n){var s,i,r={top:0,left:0};return"fixed"===t.css(n,"position")?i=n.getBoundingClientRect():(s=o(n),i=t.offset(n),i=t.offset(n),e(s,"html")||(r=t.offset(s)),r.top+=t.css(s,"borderTopWidth",!0),r.left+=t.css(s,"borderLeftWidth",!0)),{width:n.offsetWidth,height:n.offsetHeight,top:i.top-r.top-t.css(n,"marginTop",!0),left:i.left-r.left-t.css(n,"marginLeft",!0)}};var o=function(o){var n=o.ownerDocument,s=o.offsetParent||n;if(e(s,"#document"))return n.documentElement;for(;s&&!e(s,"html")&&"static"===t.css(s,"position");)s=s.offsetParent;return s||n.documentElement};return t.height=function(e,o){var n=e.offsetHeight;return o?n+=t.css(e,"marginTop",!0)+t.css(e,"marginBottom",!0):n-=t.css(e,"paddingTop",!0)+t.css(e,"paddingBottom",!0)+t.css(e,"borderTopWidth",!0)+t.css(e,"borderBottomWidth",!0),n},t.width=function(e,o){var n=e.offsetWidth;return o?n+=t.css(e,"marginLeft",!0)+t.css(e,"marginRight",!0):n-=t.css(e,"paddingLeft",!0)+t.css(e,"paddingRight",!0)+t.css(e,"borderLeftWidth",!0)+t.css(e,"borderRightWidth",!0),n},t}]);
//# sourceMappingURL=dimensions.min.js.map
'use strict';

/* Directives */

angular.module('angularjssearchbox', ['angularjssearchbox.typeahead']).
   directive('sbFocus', ['$timeout', function($timeout){
        // place focus on the the last empty (ie new) value input
        return function(scope, element){
            $timeout(function() {
                if(!scope.useKeywordFacet){
                    if(!element[0].value)
                    element[0].focus();

                }
            });
        };
   }]).
   directive('repeatDone', function() {
        // bind the value input behavior after each execution of ng-repeat
     return function(scope, element, attrs) {
            scope.bindValueInput(element);
     }
   }).
   directive('searchBox', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            templateUrl: 'templates/searchBox.html',
            scope: {
                resultList: '=',
                facetList: '=',
                debug: '=?',
                placeholder: '@?'
            },
            link: function(scope, elem, attrs){

                scope.tmpInputValue = null;
                scope.selectedResult = null;
                scope.debug = scope.debug || false;
                scope.placeholder = scope.placeholder || 'Filtrer les données';
                scope.useKeywordFacet = false;
                scope.hasKeywordFacet = false;
                scope.initDone = false;
                scope.values = {};
                scope.showPlaceHolder = true;



                // get the named facet
                function getFacet(name){
                    for (var facet in scope.facetList){
                        if(scope.facetList[facet].name === name){
                            return scope.facetList[facet];
                        }
                    }
                    return null;
                }

                // add label to item if not exist
                function initFacetList(facetList){
                    for (var facet in facetList){
                        for (var item in facetList[facet].items){
                            if(!facetList[facet].items[item].hasOwnProperty('label')){
                                // @todo add type checking to format label
                                facetList[facet].items[item].label=facetList[facet].items[item].name;
                            }
                        }
                    }
                    return facetList;
                }

                // give label of a value, return the value if not exist
                function getValueLabel(facet,value){
                    for (var filter in scope.facetList){
                        if(scope.facetList[filter].name === facet){
                            for (var item in scope.facetList[filter].items){
                                if(scope.facetList[filter].items[item].name === value){
                                    return scope.facetList[filter].items[item].label;
                                }
                            }
                        }
                    }
                    return value;
                }

                // give type of a facet, return string if not exist
                function getFacetType(facet){
                    for (var filter in scope.facetList){
                        if(scope.facetList[filter].name === facet){
                            return scope.facetList[filter].type;
                        }
                    }
                    return 'string';
                }

                // create sbResultList with type on filter
                function initSbResult(resultList){
                    var rez = [];
                    for (var filter in resultList){
                        var tmpFilter = new Object();
                        tmpFilter.key = resultList[filter].key;
                        tmpFilter.type = getFacetType(tmpFilter.key);
                        tmpFilter.value = getValueLabel(tmpFilter.key,resultList[filter].value);
                        rez.push(tmpFilter);
                    }
                    return rez;
                }

                scope.$watch("facetList", function(facetList) {
                    scope.sbFacetList = initFacetList(facetList);
                    scope.initDone = false;
                    scope.sbResultList = initSbResult(scope.resultList);

                    if(!scope.hasOwnProperty('selected')){
                        scope.selected = {key:"", value:""};
                    }
                });

                scope.$watch("resultList", function(resultList) {
                    scope.initDone = false;
                    scope.sbResultList = initSbResult(resultList);
                });

                var HOT_KEYS = [9, 13, 37, 38, 39, 40];

                //bind keyboard events: enter(13) and tab(9) on Facet Input
                elem.find('input').bind('keydown', function (evt) {

                    if (HOT_KEYS.indexOf(evt.which) === -1) {
                        return;
                    }

                    evt.preventDefault();

                    if (evt.which === 13) {
                        scope.useKeywordFacet = true;
                        $timeout(function () {
                            if(scope.useKeywordFacet)
                            {
                                scope.selected.value = "" ;
                                scope.initDone = true;
                                if(scope.hasKeywordFacet){
                                    scope.sbResultList[scope.sbResultList.length-1].value +=" " + scope.selected.key;
                                    scope.resultList[scope.resultList.length-1].value +=" " + scope.selected.key;
                                }else{
                                    scope.hasKeywordFacet = true;
                                    scope.sbResultList.push({ key : 'text', type: 'string', value :  scope.selected.key});
                                    scope.resultList.push({ key : 'text', type: 'string', value :  scope.selected.key});
                                }
                                scope.selected.key = "" ;
                                $timeout(function () {
                                    scope.selectInputFacet();
                                    scope.selectedResult = null;
                                });
                            }
                        });
                    }else if (evt.which === 9) {
                        scope.$apply(function () {
                            //angular.element(evt.srcElement).triggerHandler("keydown",{keyCode:13});
                        });
                    }
                });

                //bin focus and blur on the facet input to manage the place holder
                elem.find('input').bind('focus', function (evt) {
                    scope.$apply(function () {
                        scope.showPlaceHolder = false;
                    });
                })
                .bind('blur', function (evt) {
                        scope.$apply(function () {
                            scope.showPlaceHolder = true;
                        });
                });

                //bind keyboard events: enter(13) and tab(9) on value Input
                scope.bindValueInput = function(inputElem){
                    $timeout(function () {
                        inputElem.find('input').bind('keydown', function (evt) {

                            if (HOT_KEYS.indexOf(evt.which) === -1) {
                                // the user is writing in the input, we can send a callback to get the new values
                                scope.initDone = true;
                                return;
                            }
                            evt.preventDefault();

                            if (evt.which === 13 || evt.which === 9) {
                                if(scope.hasKeywordFacet){
                                    scope.$apply(function () {
                                        if(scope.sbResultList[scope.sbResultList.length-1].key != 'text'){
                                            var tmp = scope.sbResultList.pop();
                                            scope.sbResultList.splice(scope.sbResultList.length-1,0, tmp);
                                        }
                                    });
                                }
                                scope.$apply(function () {
                                    var tmpFilter = new Object();
                                    tmpFilter.key = scope.sbResultList[evt.target.dataset.tahIndex].key;
                                    tmpFilter.type = scope.sbResultList[evt.target.dataset.tahIndex].type;
                                    tmpFilter.value = scope.sbResultList[evt.target.dataset.tahIndex].value;
                                    scope.resultList[evt.target.dataset.tahIndex] = tmpFilter;
                                    $timeout(function() {
                                        scope.selectInputFacet();
                                    });
                                    scope.selectedResult = null;
                                });
                            }
                        });
                    },50);
                }

                // help to focus the input facet
                scope.selectInputFacet = function(){
                    elem.find('input')[elem.find('input').length-1].focus();
                }

                // return the label of a facet, or the key if not exist
                scope.getFacetLabel = function(key){
                    for (var facet in scope.sbFacetList){
                        if(scope.sbFacetList[facet].name == key)
                            return scope.sbFacetList[facet].label ;
                    }
                    if (key === "text") {
                        return "Mot(s) clé(s)";
                    }
                    return key;
                }

                // return the value of a label
                scope.getValueName = function(key, index, label) {
                    return scope.values[key][index].name || label;
                }

                // return all items of a facet
                scope.getValues = function (key, inputText){
                    var facet = getFacet(key);

                    if(facet) {
                        if(typeof facet.items == "function") {
                            if(!scope.initDone){
                                return [];
                            }else{
                                scope.initDone = false;
                            }
                            return facet.items(inputText, key).then(function(items) {
                                scope.values[key] = items;
                                return items;
                            });
                        } else {
                            scope.values[key] = facet.items;
                            return facet.items;
                        }
                    }
                }

                // handle selection with the sbTypeAhead directive (tahIndex is the $index in the ngRepeat)
                scope.$on('$typeahead.select',function (evt, value, index, tahIndex){
                    scope.$apply(function () {
                        scope.useKeywordFacet = false;
                        if(tahIndex == -1){
                            //facet selection
                            scope.selected.value = "" ;
                            scope.sbResultList.push({ key : value.name, type: value.type, value : '' });
                            scope.selected.key = "" ;
                            scope.initDone =true;
                        }else{
                            //value selection
                            $timeout(function() {
                                if(scope.hasKeywordFacet){
                                    if(scope.sbResultList[scope.sbResultList.length-1].key != 'text'){
                                        var tmp = scope.sbResultList.pop();
                                        scope.sbResultList.splice(scope.sbResultList.length-1,0, tmp);
                                        tahIndex += -1;
                                    }
                                }
                                var tmpFilter = new Object();
                                tmpFilter.key = scope.sbResultList[tahIndex].key;
                                tmpFilter.type = scope.sbResultList[tahIndex].type;
                                tmpFilter.value = scope.getValueName(tmpFilter.key, index, value);
                                scope.resultList[tahIndex] = tmpFilter;
                                scope.selectInputFacet();
                                scope.selectedResult = null;
                            },100);
                        }
                    });
                });

                // select filter (facet + value)
                scope.selectResult = function (index,evt){
                    scope.selectedResult = index ;
                    angular.element(evt.currentTarget).find('input')[0].focus();
                }

                // remove filter (facet + value)
                scope.removeFilter = function ($index){
                    if(scope.sbResultList[$index].key === "text"){
                        scope.hasKeywordFacet = false;
                    }
                    scope.sbResultList.splice($index,1);
                    scope.resultList = scope.sbResultList.slice(0);
                }

                // clean all the filters
                scope.removeAll = function (){
                    scope.hasKeywordFacet = false;
                    scope.sbResultList.length = 0;
                    scope.resultList.length = 0;
                }
            }
        }
    }]);

'use strict';
angular.module('angularjssearchbox.tooltip', ['mgcrea.ngStrap.helpers.dimensions']).provider('$sbtooltip', function () {
  var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'tooltip',
      prefixEvent: 'tooltip',
      container: false,
      placement: 'top',
      template: 'templates/tooltip.html',
      contentTemplate: false,
      trigger: 'hover focus',
      keyboard: false,
      html: false,
      show: false,
      title: '',
      type: '',
      delay: 0
    };
  this.$get = [
    '$window',
    '$rootScope',
    '$compile',
    '$q',
    '$templateCache',
    '$http',
    '$animate',
    '$timeout',
    'dimensions',
    '$$rAF',
    function ($window, $rootScope, $compile, $q, $templateCache, $http, $animate, $timeout, dimensions, $$rAF) {
      var trim = String.prototype.trim;
      var isTouch = 'createTouch' in $window.document;
      var htmlReplaceRegExp = /ng-bind="/gi;
      function TooltipFactory(element, config) {
        var $sbtooltip = {};
        // Common vars
        var nodeName = element[0].nodeName.toLowerCase();
        var options = $sbtooltip.$options = angular.extend({}, defaults, config);
        $sbtooltip.$promise = fetchTemplate(options.template);
        var scope = $sbtooltip.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        if (options.delay && angular.isString(options.delay)) {
          options.delay = parseFloat(options.delay);
        }
        // Support scope as string options
        if (options.title) {
          $sbtooltip.$scope.title = options.title;
        }
        // Provide scope helpers
        scope.$hide = function () {
          scope.$$postDigest(function () {
            $sbtooltip.hide();
          });
        };
        scope.$show = function () {
          scope.$$postDigest(function () {
            $sbtooltip.show();
          });
        };
        scope.$toggle = function () {
          scope.$$postDigest(function () {
            $sbtooltip.toggle();
          });
        };
        $sbtooltip.$isShown = scope.$isShown = false;
        // Private vars
        var timeout, hoverState;
        // Support contentTemplate option
        if (options.contentTemplate) {
          $sbtooltip.$promise = $sbtooltip.$promise.then(function (template) {
            var templateEl = angular.element(template);
            return fetchTemplate(options.contentTemplate).then(function (contentTemplate) {
              var contentEl = findElement('[ng-bind="content"]', templateEl[0]);
              if (!contentEl.length)
                contentEl = findElement('[ng-bind="title"]', templateEl[0]);
              contentEl.removeAttr('ng-bind').html(contentTemplate);
              return templateEl[0].outerHTML;
            });
          });
        }
        // Fetch, compile then initialize tooltip
        var tipLinker, tipElement, tipTemplate, tipContainer;
        $sbtooltip.$promise.then(function (template) {
          if (angular.isObject(template))
            template = template.data;
          if (options.html)
            template = template.replace(htmlReplaceRegExp, 'ng-bind-html="');
          template = trim.apply(template);
          tipTemplate = template;
          tipLinker = $compile(template);
          $sbtooltip.init();
        });
        $sbtooltip.init = function () {
          // Options: delay
          if (options.delay && angular.isNumber(options.delay)) {
            options.delay = {
              show: options.delay,
              hide: options.delay
            };
          }
          // Replace trigger on touch devices ?
          // if(isTouch && options.trigger === defaults.trigger) {
          //   options.trigger.replace(/hover/g, 'click');
          // }
          // Options : container
          if (options.container === 'self') {
            tipContainer = element;
          } else if (options.container) {
            tipContainer = findElement(options.container);
          }
          // Options: trigger
          var triggers = options.trigger.split(' ');
          angular.forEach(triggers, function (trigger) {
            if (trigger === 'click') {
              element.on('click', $sbtooltip.toggle);
            } else if (trigger !== 'manual') {
              element.on(trigger === 'hover' ? 'mouseenter' : 'focus', $sbtooltip.enter);
              element.on(trigger === 'hover' ? 'mouseleave' : 'blur', $sbtooltip.leave);
              nodeName === 'button' && trigger !== 'hover' && element.on(isTouch ? 'touchstart' : 'mousedown', $sbtooltip.$onFocusElementMouseDown);
            }
          });
          // Options: show
          if (options.show) {
            scope.$$postDigest(function () {
              options.trigger === 'focus' ? element[0].focus() : $sbtooltip.show();
            });
          }
        };
        $sbtooltip.destroy = function () {
          // Unbind events
          var triggers = options.trigger.split(' ');
          for (var i = triggers.length; i--;) {
            var trigger = triggers[i];
            if (trigger === 'click') {
              element.off('click', $sbtooltip.toggle);
            } else if (trigger !== 'manual') {
              element.off(trigger === 'hover' ? 'mouseenter' : 'focus', $sbtooltip.enter);
              element.off(trigger === 'hover' ? 'mouseleave' : 'blur', $sbtooltip.leave);
              nodeName === 'button' && trigger !== 'hover' && element.off(isTouch ? 'touchstart' : 'mousedown', $sbtooltip.$onFocusElementMouseDown);
            }
          }
          // Remove element
          if (tipElement) {
            tipElement.remove();
            tipElement = null;
          }
          // Destroy scope
          scope.$destroy();
        };
        $sbtooltip.enter = function () {
          clearTimeout(timeout);
          hoverState = 'in';
          if (!options.delay || !options.delay.show) {
            return $sbtooltip.show();
          }
          timeout = setTimeout(function () {
            if (hoverState === 'in')
              $sbtooltip.show();
          }, options.delay.show);
        };
        $sbtooltip.show = function () {
          scope.$emit(options.prefixEvent + '.show.before', $sbtooltip);
          var parent = options.container ? tipContainer : null;
          var after = options.container ? null : element;
          // Hide any existing tipElement
          if (tipElement)
            tipElement.remove();
          // Fetch a cloned element linked from template
          tipElement = $sbtooltip.$element = tipLinker(scope, function (clonedElement, scope) {
          });
          // Set the initial positioning.
          tipElement.css({
            top: '0px',
            left: '0px',
            display: 'block'
          }).addClass(options.placement);
          // Options: animation
          if (options.animation)
            tipElement.addClass(options.animation);
          // Options: type
          if (options.type)
            tipElement.addClass(options.prefixClass + '-' + options.type);
          $animate.enter(tipElement, parent, after, function () {
            scope.$emit(options.prefixEvent + '.show', $sbtooltip);
          });
          $sbtooltip.$isShown = scope.$isShown = true;
          scope.$$phase || scope.$root.$$phase || scope.$digest();
          $$rAF($sbtooltip.$applyPlacement);
          // var a = bodyEl.offsetWidth + 1; ?
          // Bind events
          if (options.keyboard) {
            if (options.trigger !== 'focus') {
              $sbtooltip.focus();
              tipElement.on('keyup', $sbtooltip.$onKeyUp);
            } else {
              element.on('keyup', $sbtooltip.$onFocusKeyUp);
            }
          }
        };
        $sbtooltip.leave = function () {
          clearTimeout(timeout);
          hoverState = 'out';
          if (!options.delay || !options.delay.hide) {
            return $sbtooltip.hide();
          }
          timeout = setTimeout(function () {
            if (hoverState === 'out') {
              $sbtooltip.hide();
            }
          }, options.delay.hide);
        };
        $sbtooltip.hide = function (blur) {
          if (!$sbtooltip.$isShown)
            return;
          scope.$emit(options.prefixEvent + '.hide.before', $sbtooltip);
          $animate.leave(tipElement, function () {
            scope.$emit(options.prefixEvent + '.hide', $sbtooltip);
          });
          $sbtooltip.$isShown = scope.$isShown = false;
          scope.$$phase || scope.$root.$$phase || scope.$digest();
          // Unbind events
          if (options.keyboard && tipElement !== null) {
            tipElement.off('keyup', $sbtooltip.$onKeyUp);
          }
          // Allow to blur the input when hidden, like when pressing enter key
          if (blur && options.trigger === 'focus') {
            return element[0].blur();
          }
        };
        $sbtooltip.toggle = function () {
          $sbtooltip.$isShown ? $sbtooltip.leave() : $sbtooltip.enter();
        };
        $sbtooltip.focus = function () {
          tipElement[0].focus();
        };
        // Protected methods
        $sbtooltip.$applyPlacement = function () {
          if (!tipElement)
            return;
          // Get the position of the tooltip element.
          var elementPosition = getPosition();
          // Get the height and width of the tooltip so we can center it.
          var tipWidth = tipElement.prop('offsetWidth'), tipHeight = tipElement.prop('offsetHeight');
          // Get the tooltip's top and left coordinates to center it with this directive.
          var tipPosition = getCalculatedOffset(options.placement, elementPosition, tipWidth, tipHeight);
          // Now set the calculated positioning.
          tipPosition.top += 'px';
          tipPosition.left += 'px';
          tipElement.css(tipPosition);
        };
        $sbtooltip.$onKeyUp = function (evt) {
          evt.which === 27 && $sbtooltip.hide();
        };
        $sbtooltip.$onFocusKeyUp = function (evt) {
          evt.which === 27 && element[0].blur();
        };
        $sbtooltip.$onFocusElementMouseDown = function (evt) {
          evt.preventDefault();
          evt.stopPropagation();
          // Some browsers do not auto-focus buttons (eg. Safari)
          $sbtooltip.$isShown ? element[0].blur() : element[0].focus();
        };
        // Private methods
        function getPosition() {
          if (options.container === 'body') {
            return dimensions.offset(element[0]);
          } else {
            return dimensions.position(element[0]);
          }
        }
        function getCalculatedOffset(placement, position, actualWidth, actualHeight) {
          var offset;
          var split = placement.split('-');
          switch (split[0]) {
          case 'right':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left + position.width
            };
            break;
          case 'bottom':
            offset = {
              top: position.top + position.height,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;
          case 'left':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left - actualWidth
            };
            break;
          default:
            offset = {
              top: position.top - actualHeight,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;
          }
          if (!split[1]) {
            return offset;
          }
          // Add support for corners @todo css
          if (split[0] === 'top' || split[0] === 'bottom') {
            switch (split[1]) {
            case 'left':
              offset.left = position.left;
              break;
            case 'right':
              offset.left = position.left + position.width - actualWidth;
            }
          } else if (split[0] === 'left' || split[0] === 'right') {
            switch (split[1]) {
            case 'top':
              offset.top = position.top - actualHeight;
              break;
            case 'bottom':
              offset.top = position.top + position.height;
            }
          }
          return offset;
        }
        return $sbtooltip;
      }
      // Helper functions
      function findElement(query, element) {
        return angular.element((element || document).querySelectorAll(query));
      }
      function fetchTemplate(template) {
        return $q.when($templateCache.get(template) || $http.get(template)).then(function (res) {
          if (angular.isObject(res)) {
            $templateCache.put(template, res.data);
            return res.data;
          }
          return res;
        });
      }
      return TooltipFactory;
    }
  ];
}).directive('bsTooltip', [
  '$window',
  '$location',
  '$sce',
  '$sbtooltip',
  '$$rAF',
  function ($window, $location, $sce, $sbtooltip, $$rAF) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        // Directive options
        var options = { scope: scope };
        angular.forEach([
          'template',
          'contentTemplate',
          'placement',
          'container',
          'delay',
          'trigger',
          'keyboard',
          'html',
          'animation',
          'type'
        ], function (key) {
          if (angular.isDefined(attr[key]))
            options[key] = attr[key];
        });
        // Observe scope attributes for change
        angular.forEach(['title'], function (key) {
          attr[key] && attr.$observe(key, function (newValue, oldValue) {
            scope[key] = $sce.trustAsHtml(newValue);
            angular.isDefined(oldValue) && $$rAF(function () {
              sbtooltip && sbtooltip.$applyPlacement();
            });
          });
        });
        // Support scope as an object
        attr.bsTooltip && scope.$watch(attr.bsTooltip, function (newValue, oldValue) {
          if (angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.title = newValue;
          }
          angular.isDefined(oldValue) && $$rAF(function () {
            sbtooltip && sbtooltip.$applyPlacement();
          });
        }, true);
        // Initialize popover
        var sbtooltip = $sbtooltip(element, options);
        // Garbage collection
        scope.$on('$destroy', function () {
          sbtooltip.destroy();
          options = null;
          sbtooltip = null;
        });
      }
    };
  }
]);
'use strict';

angular.module('angularjssearchbox.typeahead', ['angularjssearchbox.tooltip', 'mgcrea.ngStrap.helpers.parseOptions'])

  .provider('$typeahead', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'typeahead',
      placement: 'bottom-left',
      template: 'templates/typeAhead.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      minLength: 1,
      tahIndex:-1,
      filter: 'filter',
      limit: 6
    };

    this.$get = function($window, $rootScope, $sbtooltip) {

      var bodyEl = angular.element($window.document.body);

      function TypeaheadFactory(element, controller, config) {

        var $typeahead = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $typeahead = $sbtooltip(element, options);
        var parentScope = config.scope;
        var scope = $typeahead.$scope;

        scope.$resetMatches = function(){
          scope.$matches = [];
          scope.$activeIndex = 0;
        };
        scope.$resetMatches();

        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $typeahead.activate(index);
          });
        };

        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $typeahead.select(index);
          });
        };

        scope.$isVisible = function() {
          return $typeahead.$isVisible();
        };

        // Public methods

        $typeahead.update = function(matches) {
          scope.$matches = matches;
          if(scope.$activeIndex >= matches.length) {
            scope.$activeIndex = 0;
          }
        };

        $typeahead.activate = function(index) {
          scope.$activeIndex = index;
        };

        $typeahead.select = function(index) {
          var value = scope.$matches[index].value;
          controller.$setViewValue(value);
          scope.$resetMatches();
          controller.$render();
          if(parentScope) parentScope.$digest();
          // Emit event
          scope.$emit('$typeahead.select', value, index, options.tahIndex);
        };

        // Protected methods

        $typeahead.$isVisible = function() {
          if(!options.minLength || !controller) {
            return !!scope.$matches.length;
          }
          // minLength support
          return scope.$matches.length && angular.isString(controller.$viewValue) && controller.$viewValue.length >= options.minLength;
        };

        $typeahead.$getIndex = function(value) {
          var l = scope.$matches.length, i = l;
          if(!l) return;
          for(i = l; i--;) {
            if(scope.$matches[i].value === value) break;
          }
          if(i < 0) return;
          return i;
        };

        $typeahead.$onMouseDown = function(evt) {
          // Prevent blur on mousedown
          evt.preventDefault();
          evt.stopPropagation();
        };

        $typeahead.$onKeyDown = function(evt) {
          if (!/(38|40|13)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();

          // Select with enter
          if(evt.keyCode === 13 && scope.$matches.length) {
            $typeahead.select(scope.$activeIndex);
          }

          // Navigate with keyboard
          else if(evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--;
          else if(evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++;
          else if(angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
          scope.$digest();
        };

        // Overrides

        var show = $typeahead.show;
        $typeahead.show = function() {
          show();
          setTimeout(function() {
            $typeahead.$element.on('mousedown', $typeahead.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $typeahead.$onKeyDown);
            }
          });
        };

        var hide = $typeahead.hide;
        $typeahead.hide = function() {
          $typeahead.$element.off('mousedown', $typeahead.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $typeahead.$onKeyDown);
          }
          hide();
        };

        return $typeahead;

      }

      TypeaheadFactory.defaults = defaults;
      return TypeaheadFactory;

    };

  })

  .directive('sbTypeahead', function($window, $parse, $q, $typeahead, $parseOptions) {

    var defaults = $typeahead.defaults;

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'filter', 'limit', 'tahIndex', 'minLength'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Build proper ngOptions
        var filter = options.filter || defaults.filter;
        var limit = options.limit || defaults.limit;
        var ngOptions = attr.ngOptions;
        if(filter) ngOptions += ' | ' + filter + ':$viewValue';
        if(limit) ngOptions += ' | limitTo:' + limit;
        var parsedOptions = $parseOptions(ngOptions);

        // Initialize typeahead
        var typeahead = $typeahead(element, controller, options);

        var onWatch = function() {
            parsedOptions = $parseOptions(ngOptions);
            parsedOptions.valuesFn(scope, controller)
                .then(function(values) {
                    if(values.length > limit) values = values.slice(0, limit);
                    // Do not re-queue an update if a correct value has been selected
                    if(values.length === 1 && values[0].value === scope.$modelValue) return;
                    typeahead.update(values);
                    // Queue a new rendering that will leverage collection loading
                    controller.$render();
                });
        }

        if(attr.ngOptionsWatch) {
            scope.$watch(attr.ngOptionsWatch, onWatch);
        }

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          // console.warn('$watch', element.attr('ng-model'), newValue);
          scope.$modelValue = newValue; // Publish modelValue on scope for custom templates
          onWatch();
        });

        // Model rendering in view
        controller.$render = function () {
          // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          if(controller.$isEmpty(controller.$viewValue)) return element.val('');
          var index = typeahead.$getIndex(controller.$modelValue);
          var selected = angular.isDefined(index) ? typeahead.$scope.$matches[index].label : controller.$viewValue;
          selected = angular.isObject(selected) ? selected.label : selected;
          element.val(selected.replace(/<(?:.|\n)*?>/gm, '').trim());
        };

        // Garbage collection
        scope.$on('$destroy', function() {
          typeahead.destroy();
          options = null;
          typeahead = null;
        });

      }
    };

  });

angular.module("angularjssearchbox").run(["$templateCache", function($templateCache) {$templateCache.put("templates/searchBox.html","<!--<pre ng-show=\"debug\">Model: {{selected.key | json}} Value : {{ selected.value | json}} opened : {{ opened }}-->\r\n<!--{{!sbResultList.length && showPlaceHolder }}-->\r\n<!--{{ showPlaceHolder }}</pre>-->\r\n<div class=\"SB-search\">\r\n    <div class=\"SB-search-box-wrapper form-control SB-search-box \" >\r\n        <div class=\"SB-placeholder\" ng-click=\"selectInputFacet()\"><span ng-if=\"!sbResultList.length && showPlaceHolder\">{{ placeholder }}</span></div>\r\n        <div class=\"SB-search-inner\" >\r\n            <div class=\"search_parameter\" style=\"padding:0;\" ng-hide=\"sbResultList.length\"></div>\r\n            <div class=\"search_parameter\" ng-class=\"{ selected : $index == selectedResult }\"\r\n                 ng-repeat=\"parameter in sbResultList\" ng-click=\"selectResult($index,$event)\"\r\n                 repeat-done>\r\n                <div class=\"search_parameter_remove SB-icon SB-icon-cancel\" ng-click=\"removeFilter($index)\"><span class=\"fa fa-times\"></span></div>\r\n                <div class=\"key\">{{ getFacetLabel(parameter.key) }} : </div>\r\n                <div class=\"value\"  ng-if=\"(parameter.type == null || parameter.type == \'string\')\"><span class=\"SB-inputSizer\" >{{ parameter.value }}</span>\r\n                <input type=\"text\"\r\n                       data-tah-index=\"{{ $index }}\"\r\n                       ng-model=\"parameter.value\"\r\n                       class=\"form-control SB-inputValue\"\r\n                       limit=\"999\"\r\n                       data-trigger=\"focus\"\r\n                       data-min-length=\"0\"\r\n                       data-container=\"body\"\r\n                       ng-options=\"element.label as element.label + \' (\' +element.count+\')\' for element in getValues(parameter.key, $viewValue)\"\r\n                       sb-focus sb-typeahead>\r\n                </div>\r\n            </div>\r\n            </div>\r\n            <div class=\"search_parameter input-facet\">\r\n            <input\r\n                   data-min-length=\"0\"\r\n                   type=\"text\"\r\n                   ng-model=\"selected.key\"\r\n                   data-limit=\"30\"\r\n                   data-trigger=\"focus\"\r\n                   data-container=\"body\"\r\n                   data-delay=\"{ show: 500, hide: 0 }\"\r\n                   ng-options=\"element as element.label for element in sbFacetList\"\r\n                   class=\"form-control\" sb-typeahead ng-options-watch=\"sbFacetList\">\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"SB-icon SB-icon-cancel SB-cancel-search-box\" title=\"clear search\" ng-click=\"removeAll()\"><span class=\"fa fa-times-circle-o\"></span></div>\r\n    </div>\r\n</div>\r\n<!--<pre ng-show=\"debug\" style=\"margin-top: 10px;\">sbResultList: {{sbResultList | json}} </pre>-->\r\n<!--<pre ng-show=\"debug\">resultList (input/output): {{resultList | json}} </pre>-->\r\n<!--<pre ng-show=\"debug\">sbFacetList (input): {{sbFacetList | json}} </pre>-->\r\n");
$templateCache.put("templates/tooltip.html","<div class=\"tooltip in\" ng-show=\"title\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\" ng-bind=\"title\"></div></div>\r\n");
$templateCache.put("templates/typeAhead.html","<ul tabindex=\"-1\" class=\"typeahead dropdown-menu\" ng-show=\"$isVisible()\" role=\"select\">\r\n  <li role=\"presentation\" ng-repeat=\"match in $matches\" ng-class=\"{active: $index == $activeIndex}\">\r\n    <a role=\"menuitem\" tabindex=\"-1\" ng-click=\"$select($index, $event)\" ng-bind=\"match.label\"></a>\r\n  </li>\r\n</ul>\r\n");}]);