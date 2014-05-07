/**
 * angular-strap
 * @version v2.0.2 - 2014-04-27
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.typeahead",["mgcrea.ngStrap.tooltip","mgcrea.ngStrap.helpers.parseOptions"]).provider("$typeahead",function(){var e=this.defaults={animation:"am-fade",prefixClass:"typeahead",placement:"bottom-left",template:"typeahead/typeahead.tpl.html",trigger:"focus",container:!1,keyboard:!0,html:!1,delay:0,minLength:1,filter:"filter",limit:6};this.$get=["$window","$rootScope","$tooltip",function(t,n,a){function i(t,n,i){var o={},r=angular.extend({},e,i);o=a(t,r);var l=i.scope,c=o.$scope;c.$resetMatches=function(){c.$matches=[],c.$activeIndex=0},c.$resetMatches(),c.$activate=function(e){c.$$postDigest(function(){o.activate(e)})},c.$select=function(e){c.$$postDigest(function(){o.select(e)})},c.$isVisible=function(){return o.$isVisible()},o.update=function(e){c.$matches=e,c.$activeIndex>=e.length&&(c.$activeIndex=0)},o.activate=function(e){c.$activeIndex=e},o.select=function(e){var t=c.$matches[e].value;n.$setViewValue(t),c.$resetMatches(),n.$render(),l&&l.$digest(),c.$emit("$typeahead.select",t,e)},o.$isVisible=function(){return r.minLength&&n?c.$matches.length&&angular.isString(n.$viewValue)&&n.$viewValue.length>=r.minLength:!!c.$matches.length},o.$getIndex=function(e){var t=c.$matches.length,n=t;if(t){for(n=t;n--&&c.$matches[n].value!==e;);if(!(0>n))return n}},o.$onMouseDown=function(e){e.preventDefault(),e.stopPropagation()},o.$onKeyDown=function(e){/(38|40|13)/.test(e.keyCode)&&(e.preventDefault(),e.stopPropagation(),13===e.keyCode&&c.$matches.length?o.select(c.$activeIndex):38===e.keyCode&&c.$activeIndex>0?c.$activeIndex--:40===e.keyCode&&c.$activeIndex<c.$matches.length-1?c.$activeIndex++:angular.isUndefined(c.$activeIndex)&&(c.$activeIndex=0),c.$digest())};var s=o.show;o.show=function(){s(),setTimeout(function(){o.$element.on("mousedown",o.$onMouseDown),r.keyboard&&t.on("keydown",o.$onKeyDown)})};var u=o.hide;return o.hide=function(){o.$element.off("mousedown",o.$onMouseDown),r.keyboard&&t.off("keydown",o.$onKeyDown),u()},o}angular.element(t.document.body);return i.defaults=e,i}]}).directive("bsTypeahead",["$window","$parse","$q","$typeahead","$parseOptions",function(e,t,n,a,i){var o=a.defaults;return{restrict:"EAC",require:"ngModel",link:function(e,t,n,r){var l={scope:e};angular.forEach(["placement","container","delay","trigger","keyboard","html","animation","template","filter","limit","minLength"],function(e){angular.isDefined(n[e])&&(l[e]=n[e])});var c=l.filter||o.filter,s=l.limit||o.limit,u=n.ngOptions;c&&(u+=" | "+c+":$viewValue"),s&&(u+=" | limitTo:"+s);var $=i(u),d=a(t,r,l);e.$watch(n.ngModel,function(t){e.$modelValue=t,$.valuesFn(e,r).then(function(e){e.length>s&&(e=e.slice(0,s)),(1!==e.length||e[0].value!==t)&&(d.update(e),r.$render())})}),r.$render=function(){if(r.$isEmpty(r.$viewValue))return t.val("");var e=d.$getIndex(r.$modelValue),n=angular.isDefined(e)?d.$scope.$matches[e].label:r.$viewValue;n=angular.isObject(n)?n.label:n,t.val(n.replace(/<(?:.|\n)*?>/gm,"").trim())},e.$on("$destroy",function(){d.destroy(),l=null,d=null})}}}]);
/**
 * angular-strap
 * @version v2.0.2 - 2014-04-27
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.typeahead").run(["$templateCache",function(e){e.put("typeahead/typeahead.tpl.html",'<ul tabindex="-1" class="typeahead dropdown-menu" ng-show="$isVisible()" role="select"><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $index == $activeIndex}"><a role="menuitem" tabindex="-1" ng-click="$select($index, $event)" ng-bind="match.label"></a></li></ul>')}]);
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
/**
 * angular-strap
 * @version v2.0.2 - 2014-04-27
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.datepicker",["mgcrea.ngStrap.helpers.dateParser","mgcrea.ngStrap.tooltip"]).provider("$datepicker",function(){var e=this.defaults={animation:"am-fade",prefixClass:"datepicker",placement:"bottom-left",template:"datepicker/datepicker.tpl.html",trigger:"focus",container:!1,keyboard:!0,html:!1,delay:0,useNative:!1,dateType:"date",dateFormat:"shortDate",dayFormat:"dd",strictFormat:!1,autoclose:!1,minDate:-1/0,maxDate:+1/0,startView:0,minView:0,startWeek:0};this.$get=["$window","$document","$rootScope","$sce","$locale","dateFilter","datepickerViews","$tooltip",function(t,a,n,i,o,r,d,l){function s(t,a,n){function i(e){e.selected=r.$isSelected(e.date)}function o(){t[0].focus()}var r=l(t,angular.extend({},e,n)),s=n.scope,g=r.$options,$=r.$scope;g.startView&&(g.startView-=g.minView);var m=d(r);r.$views=m.views;var f=m.viewDate;$.$mode=g.startView;var h=r.$views[$.$mode];$.$select=function(e){r.select(e)},$.$selectPane=function(e){r.$selectPane(e)},$.$toggleMode=function(){r.setMode(($.$mode+1)%r.$views.length)},r.update=function(e){angular.isDate(e)&&!isNaN(e.getTime())&&(r.$date=e,h.update.call(h,e)),r.$build(!0)},r.select=function(e,t){angular.isDate(a.$dateValue)||(a.$dateValue=new Date(e)),a.$dateValue.setFullYear(e.getFullYear(),e.getMonth(),e.getDate()),!$.$mode||t?(a.$setViewValue(a.$dateValue),a.$render(),g.autoclose&&!t&&r.hide(!0)):(angular.extend(f,{year:e.getFullYear(),month:e.getMonth(),date:e.getDate()}),r.setMode($.$mode-1),r.$build())},r.setMode=function(e){$.$mode=e,h=r.$views[$.$mode],r.$build()},r.$build=function(e){e===!0&&h.built||(e!==!1||h.built)&&h.build.call(h)},r.$updateSelected=function(){for(var e=0,t=$.rows.length;t>e;e++)angular.forEach($.rows[e],i)},r.$isSelected=function(e){return h.isSelected(e)},r.$selectPane=function(e){var t=h.steps,a=new Date(Date.UTC(f.year+(t.year||0)*e,f.month+(t.month||0)*e,f.date+(t.day||0)*e));angular.extend(f,{year:a.getUTCFullYear(),month:a.getUTCMonth(),date:a.getUTCDate()}),r.$build()},r.$onMouseDown=function(e){if(e.preventDefault(),e.stopPropagation(),u){var t=angular.element(e.target);"button"!==t[0].nodeName.toLowerCase()&&(t=t.parent()),t.triggerHandler("click")}},r.$onKeyDown=function(e){if(/(38|37|39|40|13)/.test(e.keyCode)&&!e.shiftKey&&!e.altKey){if(e.preventDefault(),e.stopPropagation(),13===e.keyCode)return $.$mode?$.$apply(function(){r.setMode($.$mode-1)}):r.hide(!0);h.onKeyDown(e),s.$digest()}};var p=r.init;r.init=function(){return c&&g.useNative?(t.prop("type","date"),void t.css("-webkit-appearance","textfield")):(u&&(t.prop("type","text"),t.attr("readonly","true"),t.on("click",o)),void p())};var y=r.destroy;r.destroy=function(){c&&g.useNative&&t.off("click",o),y()};var D=r.show;r.show=function(){D(),setTimeout(function(){r.$element.on(u?"touchstart":"mousedown",r.$onMouseDown),g.keyboard&&t.on("keydown",r.$onKeyDown)})};var w=r.hide;return r.hide=function(e){r.$element.off(u?"touchstart":"mousedown",r.$onMouseDown),g.keyboard&&t.off("keydown",r.$onKeyDown),w(e)},r}var u=(angular.element(t.document.body),"createTouch"in t.document),c=/(ip(a|o)d|iphone|android)/gi.test(t.navigator.userAgent);return e.lang||(e.lang=o.id),s.defaults=e,s}]}).directive("bsDatepicker",["$window","$parse","$q","$locale","dateFilter","$datepicker","$dateParser","$timeout",function(e,t,a,n,i,o,r){var d=(o.defaults,/(ip(a|o)d|iphone|android)/gi.test(e.navigator.userAgent)),l=function(e){return!isNaN(parseFloat(e))&&isFinite(e)};return{restrict:"EAC",require:"ngModel",link:function(e,t,a,n){var s={scope:e,controller:n};angular.forEach(["placement","container","delay","trigger","keyboard","html","animation","template","autoclose","dateType","dateFormat","dayFormat","strictFormat","startWeek","useNative","lang","startView","minView"],function(e){angular.isDefined(a[e])&&(s[e]=a[e])}),d&&s.useNative&&(s.dateFormat="yyyy-MM-dd");var u=o(t,n,s);s=u.$options,angular.forEach(["minDate","maxDate"],function(e){angular.isDefined(a[e])&&a.$observe(e,function(t){if("today"===t){var a=new Date;u.$options[e]=+new Date(a.getFullYear(),a.getMonth(),a.getDate()+("maxDate"===e?1:0),0,0,0,"minDate"===e?0:-1)}else u.$options[e]=angular.isString(t)&&t.match(/^".+"$/)?+new Date(t.substr(1,t.length-2)):l(t)?+new Date(parseInt(t,10)):+new Date(t);!isNaN(u.$options[e])&&u.$build(!1)})}),e.$watch(a.ngModel,function(){u.update(n.$dateValue)},!0);var c=r({format:s.dateFormat,lang:s.lang,strict:s.strictFormat});n.$parsers.unshift(function(e){if(!e)return void n.$setValidity("date",!0);var t=c.parse(e,n.$dateValue);if(!t||isNaN(t.getTime()))return void n.$setValidity("date",!1);var a=(isNaN(u.$options.minDate)||t.getTime()>=u.$options.minDate)&&(isNaN(u.$options.maxDate)||t.getTime()<=u.$options.maxDate);return n.$setValidity("date",a),a&&(n.$dateValue=t),"string"===s.dateType?i(e,s.dateFormat):"number"===s.dateType?n.$dateValue.getTime():"iso"===s.dateType?n.$dateValue.toISOString():new Date(n.$dateValue)}),n.$formatters.push(function(e){var t;return t=angular.isUndefined(e)||null===e?0/0:angular.isDate(e)?e:"string"===s.dateType?c.parse(e):new Date(e),n.$dateValue=t,n.$dateValue}),n.$render=function(){t.val(!n.$dateValue||isNaN(n.$dateValue.getTime())?"":i(n.$dateValue,s.dateFormat))},e.$on("$destroy",function(){u.destroy(),s=null,u=null})}}}]).provider("datepickerViews",function(){function e(e,t){for(var a=[];e.length>0;)a.push(e.splice(0,t));return a}function t(e,t){return(e%t+t)%t}this.defaults={dayFormat:"dd",daySplit:7};this.$get=["$locale","$sce","dateFilter",function(a,n,i){return function(o){var r=o.$scope,d=o.$options,l=a.DATETIME_FORMATS.SHORTDAY,s=l.slice(d.startWeek).concat(l.slice(0,d.startWeek)),u=n.trustAsHtml('<th class="dow text-center">'+s.join('</th><th class="dow text-center">')+"</th>"),c=o.$date||new Date,g={year:c.getFullYear(),month:c.getMonth(),date:c.getDate()},$=(6e4*c.getTimezoneOffset(),[{format:d.dayFormat,split:7,steps:{month:1},update:function(e,t){!this.built||t||e.getFullYear()!==g.year||e.getMonth()!==g.month?(angular.extend(g,{year:o.$date.getFullYear(),month:o.$date.getMonth(),date:o.$date.getDate()}),o.$build()):e.getDate()!==g.date&&(g.date=o.$date.getDate(),o.$updateSelected())},build:function(){var a=new Date(g.year,g.month,1),n=a.getTimezoneOffset(),l=new Date(+a-864e5*t(a.getDay()-d.startWeek,7)),s=l.getTimezoneOffset();s!==n&&(l=new Date(+l+6e4*(s-n)));for(var c,$=[],m=0;42>m;m++)c=new Date(l.getFullYear(),l.getMonth(),l.getDate()+m),$.push({date:c,label:i(c,this.format),selected:o.$date&&this.isSelected(c),muted:c.getMonth()!==g.month,disabled:this.isDisabled(c)});r.title=i(a,"MMMM yyyy"),r.showLabels=!0,r.labels=u,r.rows=e($,this.split),this.built=!0},isSelected:function(e){return o.$date&&e.getFullYear()===o.$date.getFullYear()&&e.getMonth()===o.$date.getMonth()&&e.getDate()===o.$date.getDate()},isDisabled:function(e){return e.getTime()<d.minDate||e.getTime()>d.maxDate},onKeyDown:function(e){var t,a=o.$date.getTime();37===e.keyCode?t=new Date(a-864e5):38===e.keyCode?t=new Date(a-6048e5):39===e.keyCode?t=new Date(a+864e5):40===e.keyCode&&(t=new Date(a+6048e5)),this.isDisabled(t)||o.select(t,!0)}},{name:"month",format:"MMM",split:4,steps:{year:1},update:function(e){this.built&&e.getFullYear()===g.year?e.getMonth()!==g.month&&(angular.extend(g,{month:o.$date.getMonth(),date:o.$date.getDate()}),o.$updateSelected()):(angular.extend(g,{year:o.$date.getFullYear(),month:o.$date.getMonth(),date:o.$date.getDate()}),o.$build())},build:function(){for(var t,a=(new Date(g.year,0,1),[]),n=0;12>n;n++)t=new Date(g.year,n,1),a.push({date:t,label:i(t,this.format),selected:o.$isSelected(t),disabled:this.isDisabled(t)});r.title=i(t,"yyyy"),r.showLabels=!1,r.rows=e(a,this.split),this.built=!0},isSelected:function(e){return o.$date&&e.getFullYear()===o.$date.getFullYear()&&e.getMonth()===o.$date.getMonth()},isDisabled:function(e){var t=+new Date(e.getFullYear(),e.getMonth()+1,0);return t<d.minDate||e.getTime()>d.maxDate},onKeyDown:function(e){var t=o.$date.getMonth(),a=new Date(o.$date);37===e.keyCode?a.setMonth(t-1):38===e.keyCode?a.setMonth(t-4):39===e.keyCode?a.setMonth(t+1):40===e.keyCode&&a.setMonth(t+4),this.isDisabled(a)||o.select(a,!0)}},{name:"year",format:"yyyy",split:4,steps:{year:12},update:function(e,t){!this.built||t||parseInt(e.getFullYear()/20,10)!==parseInt(g.year/20,10)?(angular.extend(g,{year:o.$date.getFullYear(),month:o.$date.getMonth(),date:o.$date.getDate()}),o.$build()):e.getFullYear()!==g.year&&(angular.extend(g,{year:o.$date.getFullYear(),month:o.$date.getMonth(),date:o.$date.getDate()}),o.$updateSelected())},build:function(){for(var t,a=g.year-g.year%(3*this.split),n=[],d=0;12>d;d++)t=new Date(a+d,0,1),n.push({date:t,label:i(t,this.format),selected:o.$isSelected(t),disabled:this.isDisabled(t)});r.title=n[0].label+"-"+n[n.length-1].label,r.showLabels=!1,r.rows=e(n,this.split),this.built=!0},isSelected:function(e){return o.$date&&e.getFullYear()===o.$date.getFullYear()},isDisabled:function(e){var t=+new Date(e.getFullYear()+1,0,0);return t<d.minDate||e.getTime()>d.maxDate},onKeyDown:function(e){var t=o.$date.getFullYear(),a=new Date(o.$date);37===e.keyCode?a.setYear(t-1):38===e.keyCode?a.setYear(t-4):39===e.keyCode?a.setYear(t+1):40===e.keyCode&&a.setYear(t+4),this.isDisabled(a)||o.select(a,!0)}}]);return{views:d.minView?Array.prototype.slice.call($,d.minView):$,viewDate:g}}}]});
/**
 * angular-strap
 * @version v2.0.2 - 2014-04-27
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.ngStrap.helpers.dateParser",[]).provider("$dateParser",["$localeProvider",function(){var t=Date.prototype,e=this.defaults={format:"shortDate",strict:!1};this.$get=["$locale",function(r){var s=function(s){function n(t){var e,r=Object.keys(f),s=[],n=[],i=t;for(e=0;e<r.length;e++)if(t.split(r[e]).length>1){var a=i.search(r[e]);t=t.split(r[e]).join(""),f[r[e]]&&(s[a]=f[r[e]])}return angular.forEach(s,function(t){n.push(t)}),n}function i(t){return t.replace(/\//g,"[\\/]").replace("/-/g","[-]").replace(/\./g,"[.]").replace(/\\s/g,"[\\s]")}function a(t){var e,r=Object.keys(l),s=t;for(e=0;e<r.length;e++)s=s.split(r[e]).join("${"+e+"}");for(e=0;e<r.length;e++)s=s.split("${"+e+"}").join("("+l[r[e]]+")");return t=i(t),new RegExp("^"+s+"$",["i"])}var o,u,M=angular.extend({},e,s),c={},l={sss:"[0-9]{3}",ss:"[0-5][0-9]",s:M.strict?"[1-5]?[0-9]":"[0-9]|[0-5][0-9]",mm:"[0-5][0-9]",m:M.strict?"[1-5]?[0-9]":"[0-9]|[0-5][0-9]",HH:"[01][0-9]|2[0-3]",H:M.strict?"1?[0-9]|2[0-3]":"[01]?[0-9]|2[0-3]",hh:"[0][1-9]|[1][012]",h:M.strict?"[1-9]|1[012]":"0?[1-9]|1[012]",a:"AM|PM",EEEE:r.DATETIME_FORMATS.DAY.join("|"),EEE:r.DATETIME_FORMATS.SHORTDAY.join("|"),dd:"0[1-9]|[12][0-9]|3[01]",d:M.strict?"[1-9]|[1-2][0-9]|3[01]":"0?[1-9]|[1-2][0-9]|3[01]",MMMM:r.DATETIME_FORMATS.MONTH.join("|"),MMM:r.DATETIME_FORMATS.SHORTMONTH.join("|"),MM:"0[1-9]|1[012]",M:M.strict?"[1-9]|1[012]":"0?[1-9]|1[012]",yyyy:"[1]{1}[0-9]{3}|[2]{1}[0-9]{3}",yy:"[0-9]{2}",y:M.strict?"-?(0|[1-9][0-9]{0,3})":"-?0*[0-9]{1,4}"},f={sss:t.setMilliseconds,ss:t.setSeconds,s:t.setSeconds,mm:t.setMinutes,m:t.setMinutes,HH:t.setHours,H:t.setHours,hh:t.setHours,h:t.setHours,dd:t.setDate,d:t.setDate,a:function(t){var e=this.getHours();return this.setHours(t.match(/pm/i)?e+12:e)},MMMM:function(t){return this.setMonth(r.DATETIME_FORMATS.MONTH.indexOf(t))},MMM:function(t){return this.setMonth(r.DATETIME_FORMATS.SHORTMONTH.indexOf(t))},MM:function(t){return this.setMonth(1*t-1)},M:function(t){return this.setMonth(1*t-1)},yyyy:t.setFullYear,yy:function(t){return this.setFullYear(2e3+1*t)},y:t.setFullYear};return c.init=function(){c.$format=r.DATETIME_FORMATS[M.format]||M.format,o=a(c.$format),u=n(c.$format)},c.isValid=function(t){return angular.isDate(t)?!isNaN(t.getTime()):o.test(t)},c.parse=function(t,e){if(angular.isDate(t))return t;var r=o.exec(t);if(!r)return!1;for(var s=e||new Date(0,0,1),n=0;n<r.length-1;n++)u[n]&&u[n].call(s,r[n+1]);return s},c.init(),c};return s}]}]);
'use strict';

/* Directives */

angular.module('angularjssearchbox', ['mgcrea.ngStrap.typeahead', 'mgcrea.ngStrap.datepicker']).
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
            link: function(scope, elem, attrs){

                $timeout(function () {
                    scope.selected = {key:"", value:""};
                });

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
                                scope.$apply(function () {
                                    scope.resultList = scope.sbResultList.slice(0);
                                    elem.find('input')[elem.find('input').length-1].focus();
                                    scope.selectedResult = null;
                                });
                            }
                        });
                    });
                }

                scope.clickOnBlank = function(){
                    elem.find('input')[elem.find('input').length-1].focus();
                }
                scope.getFacetLabel = function(key){
                    for (var facet in scope.facetList){
                        if(scope.facetList[facet].name == key)
                            return scope.facetList[facet].label ;
                    }
                    return key;
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

angular.module("angularjssearchbox").run(["$templateCache", function($templateCache) {$templateCache.put("templates/searchBox.html","<pre ng-show=\"debug\">Model: {{selected.key | json}} Value : {{ selected.value | json}} opened : {{ opened }}</pre>\r\n<div class=\"VS-search\">\r\n    <div class=\"form-control VS-search-box-wrapper VS-search-box \">\r\n        <div class=\"VS-icon VS-icon-search\"><span class=\"glyphicon glyphicon-search\"></span></div>\r\n        <div class=\"VS-placeholder\"></div>\r\n        <div class=\"VS-search-inner\" >\r\n            <div class=\"search_parameter\" ng-class=\"{ selected : $index == selectedResult }\"\r\n                 ng-repeat=\"parameter in sbResultList\" ng-click=\"selectResult($index)\"\r\n                 repeat-done=\"test()\">\r\n                <div class=\"search_parameter_remove VS-icon VS-icon-cancel\" ng-click=\"removeFilter($index)\"><span class=\"glyphicon glyphicon-remove\"></span></div>\r\n                <div class=\"key\">{{ getFacetLabel(parameter.key) }}</div>\r\n                <div class=\"value\" ><span style=\"position:relative;z-index:1;display:inline-block;visibility: hidden;\" >{{ parameter.value }}</span>\r\n                <input type=\"text\"\r\n                       ng-model=\"parameter.value\"\r\n                       ng-if=\"(parameter.type == null || parameter.type == \'string\')\"\r\n                       class=\"form-control\"\r\n                       limit=\"8\"\r\n                       data-min-length=\"0\"\r\n                       style=\"position:absolute;z-index:2;width:100%;font-size:1em;top:0px;\"\r\n                       value=\"{{ parameter.value }}\"\r\n                       data-container=\"body\"\r\n                       ng-options=\"element.name as element.name + \' (\' +element.count+\')\' for element in getValues(parameter.key) | filter:{name:$viewValue}\"\r\n                       sb-focus bs-typeahead>\r\n                <input type=\"text\"\r\n                       ng-model=\"parameter.value\"\r\n                       ng-if=\"parameter.type == \'date\'\"\r\n                       class=\"form-control\"\r\n                       data-date-format=\"dd-MM-yyyy\"\r\n                       data-container=\"body\"\r\n                       style=\"position:absolute;z-index:2;width:100%;font-size:1em;top:0px;\"\r\n                       data-autoclose=\"1\"\r\n                       bs-datepicker\r\n                       sb-focus>\r\n\r\n                </div>\r\n            </div>\r\n            <div class=\"search_parameter\">\r\n            <input input-facet\r\n                   data-min-length=\"0\"\r\n                   type=\"text\"\r\n                   ng-model=\"selected.key\"\r\n                   data-limit=\"8\"\r\n                   data-trigger=\"focus\"\r\n                   data-container=\"body\"\r\n                   data-delay=\"{ show: 500, hide: 0 }\"\r\n                   ng-options=\"element as element.label for element in facetList | filter:{label:$viewValue}\"\r\n                   class=\"form-control input-facet\" bs-typeahead>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"VS-icon VS-icon-cancel VS-cancel-search-box\" title=\"clear search\" ng-click=\"removeAll()\"><span class=\"glyphicon glyphicon-remove-circle\"></span></div>\r\n    </div>\r\n</div>\r\n");}]);