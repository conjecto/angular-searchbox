'use strict';

/* Directives */

angular.module('angularjssearchbox', ['angularjssearchbox.typeahead','ngDateRange']).
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
                debug: '=?',
                dateOptions: '=?'
            },
            link: function(scope, elem, attrs){

                scope.tmpInputValue = null;
                scope.selectedResult = null;
                scope.debug = scope.debug || false;
                scope.useKeywordFacet = false;
                scope.hasKeywordFacet = false;
                scope.toDay = moment().format('DD/MM/YYYY');

                scope.dateOptions = scope.dateOptions || {
                    minDate: '01/01/2004',
                    maxDate: moment().add('years', 2),
                    showDropdowns: true,
                    showWeekNumbers: false,
                    timePicker: false,
                    timePickerIncrement: 1,
                    timePicker12Hour: false,
                    ranges: {
                        'Aujourd\'hui': [moment(), moment()],
                        'Semestre en cours': (moment().get('month')<6 ? [moment().startOf('year'), moment().startOf('year').add('months', 6).subtract('days', 1)]:[moment().startOf('year').add('months', 6), moment().endOf('year')]),
                        'Prochain Semestre': (moment().get('month')<6 ? [moment().startOf('year').add('months', 6), moment().endOf('year')]:[moment().startOf('year').add('years', 1), moment().endOf('year').add('months', 6)]),
                        'Mois dernier': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                        'Mois c +1 ': [moment().startOf('month'), moment().add('month', 1).endOf('month')]
                    },
                    opens: 'right',
                    buttonClasses: ['btn btn-default'],
                    applyClass: 'btn-small btn-primary',
                    cancelClass: 'btn-small',
                    format: 'DD/MM/YYYY',
                    separator: ' - ',
                    singleDatePicker: false,
                    locale: {
                        applyLabel: 'Valider',
                        cancelLabel: 'Annuler',
                        fromLabel: 'Du',
                        toLabel: 'Au',
                        customRangeLabel: 'Calendrier',
                        daysOfWeek: ['Di','Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
                        monthNames: ['Janvier', 'F&eacute;vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao&ucirc;t', 'Septembre', 'Octobre', 'Novembre', 'D&eacute;cembre'],
                        firstDay: 1
                    }
                };


                scope.dateOptionsDate = angular.copy(scope.dateOptions);
                scope.dateOptionsDate.singleDatePicker = true;
                scope.dateOptionsRange = angular.copy(scope.dateOptions);

                scope.changeEventDateRange = function(start, end, label) {
                    var value = this.element['context'].value;
                    var tahIndex = this.element[0].attributes[1].value;
                    scope.sbResultList[tahIndex].value = value;
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
                        tmpFilter.value = value;
                        scope.resultList[tahIndex] = tmpFilter;
                        scope.selectInputFacet();
                        scope.selectedResult = null;
                    },100);

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
                    scope.sbResultList = initSbResult(scope.resultList);

                    if(!scope.hasOwnProperty('selected')){
                        scope.selected = {key:"", value:""};
                    }
                });

                scope.$watch("resultList", function(resultList) {
                    scope.sbResultList = initSbResult(resultList);
                });

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

                //bind keyboard events: enter(13) and tab(9) on value Input
                scope.bindValueInput = function(inputElem){
                    $timeout(function () {
                        inputElem.find('input').bind('keydown', function (evt) {

                            if (HOT_KEYS.indexOf(evt.which) === -1) {
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
                                    scope.selectInputFacet();
                                    scope.selectedResult = null;
                                });
                            }
                        });
                    });
                }

                // help to focus the input facet
                scope.selectInputFacet = function(){
                    elem.find('input')[elem.find('input').length-1].focus();
                }

                scope.getFacetLabel = function(key){
                    for (var facet in scope.sbFacetList){
                        if(scope.sbFacetList[facet].name == key)
                            return scope.sbFacetList[facet].label ;
                    }
                    return key;
                }

                // return the value of a label
                scope.getValueName = function(key,index,label){
                    for (var facet in scope.sbFacetList){
                        if(scope.sbFacetList[facet].name == key)
                            return scope.sbFacetList[facet].items[index].name ;
                    }
                    return label;
                }

                // return all items of a facet
                scope.getValues = function (key){
                    for (var facet in scope.sbFacetList){
                        if(scope.sbFacetList[facet].name == key)
                        return scope.sbFacetList[facet].items ;
                    }
                    return [];
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

                // select filter (facet + value)
                scope.selectResult = function (index){
                    scope.selectedResult = index ;
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

        // Initialize typeahead
        var typeahead = $typeahead(element, controller, options);

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
