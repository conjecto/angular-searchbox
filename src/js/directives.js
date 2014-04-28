'use strict';

/* Directives */

angular.module('angularjssearchbox', ['ngAnimate','mgcrea.ngStrap.typeahead', 'mgcrea.ngStrap.datepicker']).
   directive('sbFocus', ['$timeout', function($timeout){
        return function(scope, element){
            $timeout(function() {
                if(!scope.useKeywordFacet){
                    element[0].focus();
                }
            });

        };
   }]).
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

                scope.selected = {key:"", value:""};
                scope.selectedResult = null;
                scope.debug = scope.debug || false;
                scope.useKeywordFacet = false;
                scope.hasKeywordFacet = false;

                var HOT_KEYS = [9, 13];

                //bind keyboard events: enter(13) and tab(9)
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
                                console.log('useKeyword');
                                scope.selected.value = "" ;
                                if(scope.hasKeywordFacet){
                                    scope.resultList[scope.resultList.length-1].value +=" " + scope.selected.key;
                                }else{
                                    scope.hasKeywordFacet = true;
                                    scope.resultList.push({ key : 'text', type: 'string', value :  scope.selected.key });
                                }
                                scope.selected.key = "" ;
                                $timeout(function () {
                                    elem.find('input')[elem.find('input').length-1].focus();
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

                scope.getValues = function (key){
                    for (var facet in scope.facetList){
                        if(scope.facetList[facet].name == key)
                        return scope.facetList[facet].items ;
                    }
                    return [];
                }

                scope.$on('$typeahead.select',function (evt, value){
                    scope.$apply(function () {
                        scope.useKeywordFacet = false;
                        if(typeof value === 'object'){
                            scope.selected.value = "" ;
                            if(scope.hasKeywordFacet){
                                scope.resultList.splice(scope.resultList.length-1,0, { key : value.name, type: value.type, value : '' });
                            }else{
                                scope.resultList.push({ key : value.name, type: value.type, value : '' });
                            }
                            scope.selected.key = "" ;
                        }else{
                            console.log('ffrrr');
                            $timeout(function() {
                                elem.find('input')[elem.find('input').length-1].focus();
                                scope.selectedResult = null;
                            },100);
                        }
                    });
                });

                scope.selectResult = function (index){
                    scope.selectedResult = index ;
                }

                scope.removeFilter = function ($index){
                    if(scope.resultList[$index].key === "text"){
                        scope.hasKeywordFacet = false;
                    }
                    scope.resultList.splice($index,1);
                }

                scope.removeValue = function ($index){
                    scope.selected.value = scope.resultList[$index].value ;
                    scope.resultList[$index].value = '' ;
                }

                scope.removeAll = function (){
                    scope.hasKeywordFacet = false;
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
