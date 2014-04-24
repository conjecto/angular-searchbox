'use strict';

/* Directives */


angular.module('sbApp.directives', []).
   directive('sbFocus', function(){
        return function(scope, element){
            element[0].focus();
            scope.opened = true;
        };
   }).
   directive('searchBox', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            template: '<pre ng-show="debug">Model: {{selected.key | json}} Value : {{ selected.value | json}} opened : {{ opened }}</pre>'+
                      '<div class="VS-search">'+
                        '<div class="VS-search-box-wrapper VS-search-box" >'+
                        '<div class="VS-icon VS-icon-search"></div>'+
                        '<div class="VS-placeholder"></div>'+
                        '<div class="VS-search-inner">'+
                            '<div class="search_parameter" ng-class="{ selected : $index == selectedResult }" ng-repeat="parameter in resultList" ng-click="selectResult($index)">'+
                                '<div class="search_parameter_remove VS-icon VS-icon-cancel" ng-click="removeFilter($index)"></div>'+
                                '<div class="key" >{{ parameter.key }}</div>'+
                                '<div class="value" ng-if="parameter.value != null" ng-click="removeValue($index)">{{ parameter.value }}</div>'+
                                '<input type="text" ui-keypress="{enter : \'onFreeSelectValue($index,$model)\'}" ng-model="selected.value" ng-if="parameter.value == null && (parameter.type == null || parameter.type == \'string\')" class="form-control" typeahead-on-select="onSelectValue($index, $model)" typeahead="element.name as element.name + \' (\' +element.count+\')\' for element in getValues(parameter.key) | filter:{name:$viewValue} | limitTo:8" class="form-control" sb-focus>'+
                                '<input type="text" ui-keypress="{enter : \'onFreeSelectValue($index,$model)\'}" ng-model="selected.value" ng-if="parameter.value == null && parameter.type == \'date\'" class="form-control" datepicker-popup="dd-MM-yyyy" is-open="opened" current-text="Aujourd\'huis" clear-text="Effacer" close-text="Fermer" sb-focus>'+
                            '</div>'+
                        '<input input-facet type="text" ui-keypress="{enter : \'onFreeSelect($model)\'}" ng-model="selected.key" typeahead-min-length="0" typeahead-on-select="onSelect($model)" typeahead="element as element.label for element in facetList | filter:{label:$viewValue} | limitTo:8" class="form-control input-facet">'+
                        '</div>'+
                        '<div class="VS-icon VS-icon-cancel VS-cancel-search-box" title="clear search" ng-click="removeAll()" ></div>'+
                        '</div>'+
                       '</div>',
            scope: {
                resultList: '=',
                facetList: '=',
                debug: '=?'
            },
            link: function(scope, elem, attrs){

                scope.selected = {key:null, value:null};
                scope.selectedResult = null;
                scope.debug = scope.debug || false;

                scope.getValues = function (key){
                    for (var facet in scope.facetList){
                        if(scope.facetList[facet].name == key)
                        return scope.facetList[facet].items ;
                    }
                    return [];
                }

                scope.selectResult = function (index){
                    scope.selectedResult = index ;
                }

                scope.removeFilter = function ($index){
                    scope.resultList.splice($index,1);
                }

                scope.removeValue = function ($index){
                    scope.selected.value = scope.resultList[$index].value ;
                    scope.resultList[$index].value = null ;
                }

                scope.removeAll = function (){
                    scope.resultList.length = 0;
                }

                // typeAhead facet selection
                scope.onSelect = function ($model) {
                    scope.selected.value = null ;
                    if ($model.hasOwnProperty('type')){
                        scope.resultList.push({ key : $model.name, type: $model.type, value :  null });
                    }else{
                        scope.resultList.push({ key : $model.name, type: null, value :  null });
                    }
                    scope.selected.key = null ;
                }

                // key-press enter (should be blur too) facet selection
                scope.onFreeSelect = function ($model) {
                    if ($model != null){
                        scope.selected.value = null ;
                        scope.resultList.push({ key : 'text', type: 'string', value :  $model });
                        scope.selected.key = null ;
                    }else if(scope.selected.key != null){
                        scope.selected.value = null ;
                        scope.resultList.push({ key : 'text', type: 'string', value :  scope.selected.key });
                        scope.selected.key = null ;
                    }
                }

                // typeAhead value selection
                scope.onSelectValue = function ($index, $model) {
                    scope.resultList[$index].value = $model;
                    scope.selected.key = null ;
                    scope.selected.value = null ;
                    $timeout(function() {
                        elem.find('input')[elem.find('input').length-1].focus();
                        scope.selectedResult = null;
                    });
                }

                // key-press enter (should be blur too) value selection
                scope.onFreeSelectValue = function ($index,$model) {
                    if ($model != null){
                        scope.resultList[$index].value =  $model ;
                        scope.selected.key = null ;
                        scope.selected.value = null ;
                        $timeout(function() {
                            elem.find('input')[elem.find('input').length-1].focus();
                            scope.selectedResult = null;
                        });
                    }else if (scope.selected.value != null){
                        scope.resultList[$index].value =  scope.selected.value ;
                        scope.selected.key = null ;
                        scope.selected.value = null ;
                        $timeout(function() {
                            elem.find('input')[elem.find('input').length-1].focus();
                            scope.selectedResult = null;
                        });
                    }

                }

            }
        }
    }]);
