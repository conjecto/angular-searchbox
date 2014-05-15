/**
 * angular-strap
 * @version v2.0.2 - 2014-04-27
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.tooltip",["mgcrea.ngStrap.helpers.dimensions"]).provider("$tooltip",function(){var e=this.defaults={animation:"am-fade",prefixClass:"tooltip",prefixEvent:"tooltip",container:!1,placement:"top",template:"tooltip/tooltip.tpl.html",contentTemplate:!1,trigger:"hover focus",keyboard:!1,html:!1,show:!1,title:"",type:"",delay:0};this.$get=["$window","$rootScope","$compile","$q","$templateCache","$http","$animate","$timeout","dimensions","$$rAF",function(t,o,n,i,a,r,l,s,u,c){function p(t,i){function a(){return"body"===g.container?u.offset(t[0]):u.position(t[0])}function r(e,t,o,n){var i,a=e.split("-");switch(a[0]){case"right":i={top:t.top+t.height/2-n/2,left:t.left+t.width};break;case"bottom":i={top:t.top+t.height,left:t.left+t.width/2-o/2};break;case"left":i={top:t.top+t.height/2-n/2,left:t.left-o};break;default:i={top:t.top-n,left:t.left+t.width/2-o/2}}if(!a[1])return i;if("top"===a[0]||"bottom"===a[0])switch(a[1]){case"left":i.left=t.left;break;case"right":i.left=t.left+t.width-o}else if("left"===a[0]||"right"===a[0])switch(a[1]){case"top":i.top=t.top-n;break;case"bottom":i.top=t.top+t.height}return i}var s={},p=t[0].nodeName.toLowerCase(),g=s.$options=angular.extend({},e,i);s.$promise=h(g.template);var v=s.$scope=g.scope&&g.scope.$new()||o.$new();g.delay&&angular.isString(g.delay)&&(g.delay=parseFloat(g.delay)),g.title&&(s.$scope.title=g.title),v.$hide=function(){v.$$postDigest(function(){s.hide()})},v.$show=function(){v.$$postDigest(function(){s.show()})},v.$toggle=function(){v.$$postDigest(function(){s.toggle()})},s.$isShown=v.$isShown=!1;var y,w;g.contentTemplate&&(s.$promise=s.$promise.then(function(e){var t=angular.element(e);return h(g.contentTemplate).then(function(e){var o=f('[ng-bind="content"]',t[0]);return o.length||(o=f('[ng-bind="title"]',t[0])),o.removeAttr("ng-bind").html(e),t[0].outerHTML})}));var b,k,S,x;return s.$promise.then(function(e){angular.isObject(e)&&(e=e.data),g.html&&(e=e.replace(m,'ng-bind-html="')),e=d.apply(e),S=e,b=n(e),s.init()}),s.init=function(){g.delay&&angular.isNumber(g.delay)&&(g.delay={show:g.delay,hide:g.delay}),"self"===g.container?x=t:g.container&&(x=f(g.container));var e=g.trigger.split(" ");angular.forEach(e,function(e){"click"===e?t.on("click",s.toggle):"manual"!==e&&(t.on("hover"===e?"mouseenter":"focus",s.enter),t.on("hover"===e?"mouseleave":"blur",s.leave),"button"===p&&"hover"!==e&&t.on($?"touchstart":"mousedown",s.$onFocusElementMouseDown))}),g.show&&v.$$postDigest(function(){"focus"===g.trigger?t[0].focus():s.show()})},s.destroy=function(){for(var e=g.trigger.split(" "),o=e.length;o--;){var n=e[o];"click"===n?t.off("click",s.toggle):"manual"!==n&&(t.off("hover"===n?"mouseenter":"focus",s.enter),t.off("hover"===n?"mouseleave":"blur",s.leave),"button"===p&&"hover"!==n&&t.off($?"touchstart":"mousedown",s.$onFocusElementMouseDown))}k&&(k.remove(),k=null),v.$destroy()},s.enter=function(){return clearTimeout(y),w="in",g.delay&&g.delay.show?void(y=setTimeout(function(){"in"===w&&s.show()},g.delay.show)):s.show()},s.show=function(){v.$emit(g.prefixEvent+".show.before",s);var e=g.container?x:null,o=g.container?null:t;k&&k.remove(),k=s.$element=b(v,function(){}),k.css({top:"0px",left:"0px",display:"block"}).addClass(g.placement),g.animation&&k.addClass(g.animation),g.type&&k.addClass(g.prefixClass+"-"+g.type),l.enter(k,e,o,function(){v.$emit(g.prefixEvent+".show",s)}),s.$isShown=v.$isShown=!0,v.$$phase||v.$root.$$phase||v.$digest(),c(s.$applyPlacement),g.keyboard&&("focus"!==g.trigger?(s.focus(),k.on("keyup",s.$onKeyUp)):t.on("keyup",s.$onFocusKeyUp))},s.leave=function(){return clearTimeout(y),w="out",g.delay&&g.delay.hide?void(y=setTimeout(function(){"out"===w&&s.hide()},g.delay.hide)):s.hide()},s.hide=function(e){return s.$isShown?(v.$emit(g.prefixEvent+".hide.before",s),l.leave(k,function(){v.$emit(g.prefixEvent+".hide",s)}),s.$isShown=v.$isShown=!1,v.$$phase||v.$root.$$phase||v.$digest(),g.keyboard&&null!==k&&k.off("keyup",s.$onKeyUp),e&&"focus"===g.trigger?t[0].blur():void 0):void 0},s.toggle=function(){s.$isShown?s.leave():s.enter()},s.focus=function(){k[0].focus()},s.$applyPlacement=function(){if(k){var e=a(),t=k.prop("offsetWidth"),o=k.prop("offsetHeight"),n=r(g.placement,e,t,o);n.top+="px",n.left+="px",k.css(n)}},s.$onKeyUp=function(e){27===e.which&&s.hide()},s.$onFocusKeyUp=function(e){27===e.which&&t[0].blur()},s.$onFocusElementMouseDown=function(e){e.preventDefault(),e.stopPropagation(),s.$isShown?t[0].blur():t[0].focus()},s}function f(e,t){return angular.element((t||document).querySelectorAll(e))}function h(e){return i.when(a.get(e)||r.get(e)).then(function(t){return angular.isObject(t)?(a.put(e,t.data),t.data):t})}var d=String.prototype.trim,$="createTouch"in t.document,m=/ng-bind="/gi;return p}]}).directive("bsTooltip",["$window","$location","$sce","$tooltip","$$rAF",function(e,t,o,n,i){return{restrict:"EAC",scope:!0,link:function(e,t,a){var r={scope:e};angular.forEach(["template","contentTemplate","placement","container","delay","trigger","keyboard","html","animation","type"],function(e){angular.isDefined(a[e])&&(r[e]=a[e])}),angular.forEach(["title"],function(t){a[t]&&a.$observe(t,function(n,a){e[t]=o.trustAsHtml(n),angular.isDefined(a)&&i(function(){l&&l.$applyPlacement()})})}),a.bsTooltip&&e.$watch(a.bsTooltip,function(t,o){angular.isObject(t)?angular.extend(e,t):e.title=t,angular.isDefined(o)&&i(function(){l&&l.$applyPlacement()})},!0);var l=n(t,r);e.$on("$destroy",function(){l.destroy(),r=null,l=null})}}}]);
/**
 * angular-strap
 * @version v2.0.2 - 2014-04-27
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.tooltip").run(["$templateCache",function(t){t.put("tooltip/tooltip.tpl.html",'<div class="tooltip in" ng-show="title"><div class="tooltip-arrow"></div><div class="tooltip-inner" ng-bind="title"></div></div>')}]);
/**
 * angular-strap
 * @version v2.0.2 - 2014-04-27
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.helpers.parseOptions",[]).provider("$parseOptions",function(){var n=this.defaults={regexp:/^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/};this.$get=["$parse","$q",function(s,r){function e(e,t){function a(n,s){return n.map(function(n,r){var e,t,a={};return a[c]=n,e=o(s,a),t=f(s,a)||r,{label:e,value:t}})}var u={},i=angular.extend({},n,t);u.$values=[];var $,o,c,l,p,f,v;return u.init=function(){u.$match=$=e.match(i.regexp),o=s($[2]||$[1]),c=$[4]||$[6],l=$[5],p=s($[3]||""),f=s($[2]?$[1]:c),v=s($[7])},u.valuesFn=function(n,s){return r.when(v(n,s)).then(function(s){return u.$values=s?a(s,n):{},u.$values})},u.init(),u}return e}]});
/**
 * angular-strap
 * @version v2.0.2 - 2014-04-27
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.helpers.dimensions",[]).factory("dimensions",["$document","$window",function(){var t=(angular.element,{}),e=t.nodeName=function(t,e){return t.nodeName&&t.nodeName.toLowerCase()===e.toLowerCase()};t.css=function(t,e,o){var n;return n=t.currentStyle?t.currentStyle[e]:window.getComputedStyle?window.getComputedStyle(t)[e]:t.style[e],o===!0?parseFloat(n)||0:n},t.offset=function(t){var e=t.getBoundingClientRect(),o=t.ownerDocument;return{width:t.offsetWidth,height:t.offsetHeight,top:e.top+(window.pageYOffset||o.documentElement.scrollTop)-(o.documentElement.clientTop||0),left:e.left+(window.pageXOffset||o.documentElement.scrollLeft)-(o.documentElement.clientLeft||0)}},t.position=function(n){var s,r,i={top:0,left:0};return"fixed"===t.css(n,"position")?r=n.getBoundingClientRect():(s=o(n),r=t.offset(n),r=t.offset(n),e(s,"html")||(i=t.offset(s)),i.top+=t.css(s,"borderTopWidth",!0),i.left+=t.css(s,"borderLeftWidth",!0)),{width:n.offsetWidth,height:n.offsetHeight,top:r.top-i.top-t.css(n,"marginTop",!0),left:r.left-i.left-t.css(n,"marginLeft",!0)}};var o=function(o){var n=o.ownerDocument,s=o.offsetParent||n;if(e(s,"#document"))return n.documentElement;for(;s&&!e(s,"html")&&"static"===t.css(s,"position");)s=s.offsetParent;return s||n.documentElement};return t.height=function(e,o){var n=e.offsetHeight;return o?n+=t.css(e,"marginTop",!0)+t.css(e,"marginBottom",!0):n-=t.css(e,"paddingTop",!0)+t.css(e,"paddingBottom",!0)+t.css(e,"borderTopWidth",!0)+t.css(e,"borderBottomWidth",!0),n},t.width=function(e,o){var n=e.offsetWidth;return o?n+=t.css(e,"marginLeft",!0)+t.css(e,"marginRight",!0):n-=t.css(e,"paddingLeft",!0)+t.css(e,"paddingRight",!0)+t.css(e,"borderLeftWidth",!0)+t.css(e,"borderRightWidth",!0),n},t}]);
'use strict';

/* Directives */

angular.module('angularjssearchbox', ['angularjssearchbox.typeahead']).
   directive('sbFocus', ['$timeout', function($timeout){
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
                debug: '=?'
            },
            controller: function($scope){

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
                function getValueLabel(facet,value){
                    for (var filter in $scope.facetList){
                        if($scope.facetList[filter].name === facet){
                            for (var item in $scope.facetList[filter].items){
                                if($scope.facetList[filter].items[item].name === value){
                                    return $scope.facetList[filter].items[item].label;
                                }
                            }
                        }
                    }
                    return value;
                }
                function initSbResult(resultList){
                    var rez = [];
                    for (var filter in resultList){
                        var tmpFilter = new Object();
                        tmpFilter.key = resultList[filter].key;
                        tmpFilter.type = "string";
                        tmpFilter.value = getValueLabel(tmpFilter.key,resultList[filter].value);
                        rez.push(tmpFilter);
                    }
                    return rez;
                }
                $scope.facetList = initFacetList($scope.facetList);
                $scope.sbResultList = initSbResult($scope.resultList);
                $scope.selected = {key:"", value:""};

            },
            link: function(scope, elem, attrs){

                scope.tmpInputValue = null;
                scope.selectedResult = null;
                scope.debug = scope.debug || false;
                scope.useKeywordFacet = false;
                scope.hasKeywordFacet = false;


                var HOT_KEYS = [9, 13, 37, 39];

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

                scope.bindValueInput = function(inputElem){
                    $timeout(function () {
                        inputElem.find('input').bind('keydown', function (evt) {

                            if (HOT_KEYS.indexOf(evt.which) === -1) {
                                return;
                            }

                            evt.preventDefault();

                            if (evt.which === 13 || evt.which === 9) {
                                console.log(evt);
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
                                    tmpFilter.key = scope.sbResultList[evt.srcElement.dataset.tahIndex].key;
                                    tmpFilter.type = scope.sbResultList[evt.srcElement.dataset.tahIndex].type;
                                    tmpFilter.value = scope.sbResultList[evt.srcElement.dataset.tahIndex].value;
                                    scope.resultList[evt.srcElement.dataset.tahIndex] = tmpFilter;
                                    scope.selectInputFacet();
                                    scope.selectedResult = null;
                                });
                            }
                        });
                    });
                }

                scope.selectInputFacet = function(){
                    elem.find('input')[elem.find('input').length-1].focus();
                }

                scope.getFacetLabel = function(key){
                    for (var facet in scope.facetList){
                        if(scope.facetList[facet].name == key)
                            return scope.facetList[facet].label ;
                    }
                    return key;
                }

                scope.getValueName = function(key,index,label){
                    for (var facet in scope.facetList){
                        if(scope.facetList[facet].name == key)
                            return scope.facetList[facet].items[index].name ;
                    }
                    return label;
                }

                scope.getValues = function (key){
                    for (var facet in scope.facetList){
                        if(scope.facetList[facet].name == key)
                        return scope.facetList[facet].items ;
                    }
                    return [];
                }

                scope.$on('$typeahead.select',function (evt, value,index, tahIndex){
                    scope.$apply(function () {
                        scope.useKeywordFacet = false;
//                        console.log(tahIndex);
                        if(tahIndex == -1){
                            //facet selection
                            scope.selected.value = "" ;
                            scope.sbResultList.push({ key : value.name, type: value.type, value : '' });
                            scope.selected.key = "" ;
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
                                tmpFilter.value = scope.getValueName(tmpFilter.key,index,value);
                                scope.resultList[tahIndex] = tmpFilter;
                                scope.selectInputFacet();
                                scope.selectedResult = null;
                            },100);
                        }
                    });
                });

                scope.selectResult = function (index){
                    scope.selectedResult = index ;
                }

                scope.removeFilter = function ($index){
                    if(scope.sbResultList[$index].key === "text"){
                        scope.hasKeywordFacet = false;
                    }
                    scope.sbResultList.splice($index,1);
                    scope.resultList = scope.sbResultList.slice(0);
                }

                scope.removeAll = function (){
                    scope.hasKeywordFacet = false;
                    scope.sbResultList.length = 0;
                    scope.resultList.length = 0;
                }
            }
        }
    }]);

'use strict';

angular.module('angularjssearchbox.typeahead', ['mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions'])

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

    this.$get = function($window, $rootScope, $tooltip) {

      var bodyEl = angular.element($window.document.body);

      function TypeaheadFactory(element, controller, config) {

        var $typeahead = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $typeahead = $tooltip(element, options);
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

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          // console.warn('$watch', element.attr('ng-model'), newValue);
          scope.$modelValue = newValue; // Publish modelValue on scope for custom templates
          parsedOptions.valuesFn(scope, controller)
          .then(function(values) {
            if(values.length > limit) values = values.slice(0, limit);
            // Do not re-queue an update if a correct value has been selected
            if(values.length === 1 && values[0].value === newValue) return;
            typeahead.update(values);
            // Queue a new rendering that will leverage collection loading
            controller.$render();
          });
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

angular.module("angularjssearchbox").run(["$templateCache", function($templateCache) {$templateCache.put("templates/searchBox.html","<pre ng-show=\"debug\">Model: {{selected.key | json}} Value : {{ selected.value | json}} opened : {{ opened }}</pre>\r\n<div class=\"SB-search\">\r\n    <div class=\"SB-search-box-wrapper form-control SB-search-box \" >\r\n        <div class=\"SB-icon SB-icon-search\"><span class=\"glyphicon glyphicon-search\"></span></div>\r\n        <div class=\"SB-placeholder\" ng-click=\"selectInputFacet()\"></div>\r\n        <div class=\"SB-search-inner\" >\r\n            <div class=\"search_parameter\" ng-class=\"{ selected : $index == selectedResult }\"\r\n                 ng-repeat=\"parameter in sbResultList\" ng-click=\"selectResult($index)\"\r\n                 repeat-done>\r\n                <div class=\"search_parameter_remove SB-icon SB-icon-cancel\" ng-click=\"removeFilter($index)\"><span class=\"glyphicon glyphicon-remove\"></span></div>\r\n                <div class=\"key\">{{ getFacetLabel(parameter.key) }}</div>\r\n                <div class=\"value\" ><span class=\"SB-inputSizer\" >{{ parameter.value }}</span>\r\n                <input type=\"text\"\r\n                       data-tah-index=\"{{ $index }}\"\r\n                       ng-model=\"parameter.value\"\r\n                       ng-if=\"(parameter.type == null || parameter.type == \'string\')\"\r\n                       class=\"form-control SB-inputValue\"\r\n                       limit=\"8\"\r\n                       data-trigger=\"focus\"\r\n                       data-min-length=\"0\"\r\n                       data-container=\"body\"\r\n                       ng-options=\"element.label as element.label + \' (\' +element.count+\')\' for element in getValues(parameter.key) | filter:{label:$viewValue}\"\r\n                       sb-focus sb-typeahead>\r\n                </div>\r\n            </div>\r\n            <div class=\"search_parameter input-facet\">\r\n            <input\r\n                   data-min-length=\"0\"\r\n                   type=\"text\"\r\n                   ng-model=\"selected.key\"\r\n                   data-limit=\"30\"\r\n                   data-trigger=\"focus\"\r\n                   data-container=\"body\"\r\n                   data-delay=\"{ show: 500, hide: 0 }\"\r\n                   ng-options=\"element as element.label for element in facetList | filter:{label:$viewValue}\"\r\n                   class=\"form-control\" sb-typeahead>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"SB-icon SB-icon-cancel SB-cancel-search-box\" title=\"clear search\" ng-click=\"removeAll()\"><span class=\"glyphicon glyphicon-remove-circle\"></span></div>\r\n    </div>\r\n</div>\r\n<pre ng-show=\"debug\" style=\"margin-top: 10px;\">sbResultList: {{sbResultList | json}} </pre>\r\n<pre ng-show=\"debug\">resultList (input/output): {{resultList | json}} </pre>\r\n<pre ng-show=\"debug\">facetList (input): {{facetList | json}} </pre>\r\n");
$templateCache.put("templates/typeAhead.html","<ul tabindex=\"-1\" class=\"typeahead dropdown-menu\" ng-show=\"$isVisible()\" role=\"select\">\n  <li role=\"presentation\" ng-repeat=\"match in $matches\" ng-class=\"{active: $index == $activeIndex}\">\n    <a role=\"menuitem\" tabindex=\"-1\" ng-click=\"$select($index, $event)\" ng-bind=\"match.label\"></a>\n  </li>\n</ul>\n");}]);