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
            link: function(scope, elem, attrs){

                scope.selected = {key:"", value:""};
                scope.selectedResult = null;
                scope.debug = scope.debug || false;
                scope.useKeywordFacet = false;
                scope.hasKeywordFacet = false;
                scope.sbResultList = scope.resultList.slice(0);

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
                                }else{
                                    scope.hasKeywordFacet = true;
                                    scope.sbResultList.push({ key : 'text', type: 'string', value :  scope.selected.key });
                                }
                                scope.selected.key = "" ;
                                $timeout(function () {
                                    scope.resultList = scope.sbResultList.slice(0);
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
                                scope.resultList = scope.sbResultList.slice(0);
                                elem.find('input')[elem.find('input').length-1].focus();
                                scope.selectedResult = null;
                            }
                        });
                    });
                }

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
                            scope.sbResultList.push({ key : value.name, type: value.type, value : '' });
                            scope.selected.key = "" ;
                        }else{
                            $timeout(function() {
                                if(scope.hasKeywordFacet){
                                    if(scope.sbResultList[scope.sbResultList.length-1].key != 'text'){
                                        var tmp = scope.sbResultList.pop();
                                        scope.sbResultList.splice(scope.sbResultList.length-1,0, tmp);
                                    }
                                }
                                scope.resultList = scope.sbResultList.slice(0);
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
