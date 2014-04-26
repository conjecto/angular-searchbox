'use strict';

/* Directives */

angular.module('angularjssearchbox', ['ui.bootstrap', 'ui']).
   directive('sbFocus', function(){
        return function(scope, element){
            element[0].focus();
            scope.opened = true;
        };
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
