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
