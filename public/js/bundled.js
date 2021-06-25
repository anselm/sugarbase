/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/business_logic.js":
/*!*************************************!*\
  !*** ./public/js/business_logic.js ***!
  \*************************************/
/***/ (() => {

eval("///\n/// Typically a developer will have some application state somewhere... here are some of my practices:\n///\n/// I like to make that state a global resource\n/// I tend to also not mix display and control (MVC pattern). This layer should not know HTML exists as a concept at all.\n/// I often do my own reactivity scheme; this here is just an example; https://mobx.js.org is also nice.\n///\n\nwindow.appstate = {\n\n\trealstate:{},\n\tobservers:{},\n\tobserverid:0,\n\n\t///\n\t/// a custom simple reactivity / observability pattern\n\t///\n\n\tobserve: function(name,callback) {\n\t\tthis.observerid++;\n\t\tlet scope = this\n\t\tif(!this.realstate.hasOwnProperty(name)) {\n\t\t\tthis.realstate[name] = 0\n\t\t\tObject.defineProperty(scope,name,{\n\t\t\t\tget: function() { return scope.realstate[name] },\n\t\t\t\tset: function(value) {\n\t\t\t\t\tconsole.log(value)\n\t\t\t\t\tscope.realstate[name] = value\n\t\t\t\t\tif(!scope.observers[name]) return\n\t\t\t\t\tscope.observers[name].forEach( callback => { callback(); })\n\t\t\t\t}\n\t\t\t})\n\t\t}\n\t\tif(!this.observers[name]) this.observers[name] = []\n\t\tlet obs = this.observers[name]\n\t\tobs[this.observerid] = callback\n\t\treturn this.observerid\n\t},\n\n\t/// business logic\n\n\tlogin: function() {\n\t\tthis.currentParty = {moniker:\"george\"}\n\t},\n\n\tsignout: function() {\n\t\tthis.currentParty = 0\n\t},\n}\n\n\n\n//# sourceURL=webpack://sugarbase/./public/js/business_logic.js?");

/***/ }),

/***/ "./public/js/common/router.js":
/*!************************************!*\
  !*** ./public/js/common/router.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Router\": () => (/* binding */ Router)\n/* harmony export */ });\n\n///\n/// Router\n///\n/// A client side url based router; supply handlers with use()\n///\n\nclass Router {\n\n\t///\n\t/// go to current url in browser bar\n\t///\n\n\treset() {\n\t\tthis._show()\n\t}\n\n\t///\n\t/// setup\n\t///\n\n\tconstructor() {\n\n\t\t// a list of handlers\n\t\tthis.routes = {}\n\t\tthis.reverse = {}\n\n\t\t// watch user navigation events\n\t\twindow.addEventListener(\"popstate\", (e) => {\n\t\t\tthis._show(document.location.pathname,\"pop\")\n\t\t})\n\n\t\t// watch user navigation events - monkey patch browser\n\t\tvar previousPushState = history.pushState.bind(history)\n\t\thistory.pushState = (state,path,origin) => {\n\t\t\tpreviousPushState(state,path,origin)\n\t\t\tthis._show(path,\"push\")\n\t\t}\n\n\t\t// catch all hrefs globally everywhere all the time\n\t\tdocument.addEventListener('click', function (event) {\n\n\t\t\tif(event.target.type == \"file\") return true\n\n\t\t\t// find actual href somewhere around here\n\t\t\tvar target = event.target || event.srcElement;\n\t\t\twhile (target) {\n\t\t\t\tif (target instanceof HTMLAnchorElement) break\n\t\t\t\ttarget = target.parentNode\n\t\t\t}\n\n\t\t\t// get at the raw value that was set - not the one that is magically made by some wrapper\n\t\t\tlet raw = target ? target.getAttribute(\"href\") : 0 // target.href is \"produced\" by some weird wrapper\n\n\t\t\t// this router is only interested in specific urls that exist and that route locally\n\t\t\tif(!raw || !raw.length || raw.startsWith(\"http\")) {\n\t\t\t\treturn true\n\t\t\t}\n\n\t\t\t// stop anything else\n\t\t\tevent.preventDefault()\n\n\t\t\t// get the local fragment\n\t\t\tlet path = (new URL(target.href)).pathname\n\n\t\t\t// force transition here\n\t\t\thistory.pushState({},path,path)\n\n\t\t\t// stop propagation also (may not be needed)\n\t\t\treturn false\n\n\t\t}, false)\n\n\t}\n\n\t///\n\t/// Add a handler to the list of handlers to try to resolve a url change\n\t///\n\n\tuse(handler) {\n\t\tif(!this.handlers) this.handlers = []\n\t\tthis.handlers.push(handler)\n\t\treturn this\n\t}\n\n\t///\n\t/// Show the right page for a url\n\t///\n\n\tasync _show(url=0) {\n\n\t\t// if no explicit name then look at current url\n\t\tif(!url) url = location.pathname\n\n\t\t// remove hash\n\t\turl = url.split(\"#\")[0]\n\n\t\t// skip past any noise at the start of the path\n\t\tif(url && url.startsWith(\"/\")) url = url.substring(1)\n\n\t\t// get url as parts\n\t\tlet segments = url.split(\"/\")\n\n\t\tlet classIdentifier = 0\n\n\t\t// ask handlers about url and get back a named dom element\n\t\tfor(let i = 0;classIdentifier==0 && i<this.handlers.length;i++) {\n\t\t\tclassIdentifier = await this.handlers[i](segments)\n\t\t}\n\n\t\t// error\n\t\tif(!classIdentifier) {\n\t\t\tconsole.error(\"Router: bad handler name=\" + url)\n\t\t\treturn 0\n\t\t}\n\n\t\t// make dom element\n\t\tlet elem = this._make(classIdentifier,url)\n\n\t\tif(!elem) {\n\t\t\tconsole.error(\"Router: could not resolve name=\" + url)\n\t\t\treturn\n\t\t}\n\n\t\t// attach to display\n\t\tthis._glue(elem)\n\t}\n\n\t_make(classIdentifier,url) {\n\n\t\t// remember\n\t\tif(!this.producedClasses) {\n\t\t\tthis.producedClasses = {}\n\t\t\tthis.producedNames = {}\n\t\t}\n\n\t\tlet elem = 0\n\n\t\t// if an object is supplied then use as is\n\t\t//if(typeof classIdentifier === 'object') {\n\t\t//\telem = classIdentifier\n\t\t//}\n\n\t\t// if this url was visited use previous\n\t\tlet code = url+classIdentifier\n\t\tif(this.producedNames[code]) {\n\t\t\telem = this.producedNames[code]\n\t\t}\n\n\t\t// else if is a string then try make\n\t\telse if (typeof classIdentifier === 'string' || classIdentifier instanceof String) {\n\t\t\tif(this.producedClasses[classIdentifier]) {\n\t\t\t\telem = this.producedClasses[classIdentifier]\n\t\t\t} else {\n\t\t\t\telem = document.createElement(classIdentifier)\n\t\t\t\tif(!elem) {\n\t\t\t\t\tconsole.error(\"Router: cannot make \" + classIdentifier)\n\t\t\t\t\treturn 0\n\t\t\t\t}\n\t\t\t\tif(elem) {\n\t\t\t\t\telem.id = code\n\t\t\t\t\t//elem.classList.add(\"hidden\") <- must not hide because it messes up initial layouts\n\t\t\t\t\tthis.producedNames[code] = elem\n\t\t\t\t\tthis.producedClasses[classIdentifier] = elem\n\t\t\t\t\tdocument.body.appendChild(elem)\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn elem\n\t}\n\n\t_glue(elem) {\n\n\t\t// another way was to hide all... \n\n\t\t// hide previous?\n\t\tif(this.previous) {\n\t\t\tif(elem && this.previous.id == elem.id) {\n\t\t\t\t// hmm, is self... do nothing i guess?\n\t\t\t} else {\n\t\t\t\tthis.previous.classList.add(\"hidden\")\n\t\t\t\tthis.previous.hidden = true\n\t\t\t\tif(this.previous.componentDidHide instanceof Function) {\n\t\t\t\t\tthis.previous.componentDidHide()\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\t// remember previous\n\t\tthis.previous = elem\n\n\t\t// this is disabled; basically if an item is reshown and it visible then the component will be advised anyway\n\t\t//if(elem.hidden==false) {\n\t\t//\tchoose to do nothing here\n\t\t//}\n\n\t\t// call a helper that lets the page repaint itself as it wishes - a promise here helps reduce flickering\n\n\t\tif(elem.componentWillShow) {\n\t\t\tlet promise = elem.componentWillShow()\n\t\t\tif(promise) {\n\t\t\t\tpromise.then( () => {\n\t\t\t\t\telem.classList.remove(\"hidden\")\n\t\t\t\t\telem.hidden = false\n\t\t\t\t})\n\t\t\t} else {\n\t\t\t\telem.classList.remove(\"hidden\")\n\t\t\t\telem.hidden = false\n\t\t\t}\n\t\t} else {\n\t\t\telem.classList.remove(\"hidden\")\n\t\t\telem.hidden = false\n\t\t}\n\n\n\t}\n\n\t///\n\t/// sugar specific convenience concept - allow registration of simple routes\n\t///\tsupply a user path such as \"settings\" and the dom object to build and optional conditions\n\t///\n\n\tadd(path,elem,condition=0) {\n\t\tif(!path || !elem || !path.length || !elem.length) return\n\t\tthis.routes[path] = this.reverse[elem] = { path:path, elem:elem, condition:condition }\n\t}\n\n\t///\n\t/// given some kind of string or target - go to it\n\t///\n\n\tgoto(blob=null,command=0) {\n\t\tif(blob && typeof blob === 'string') {\n\t\t\t// got to named element\n\t\t\tlet rev = router.reverse[blob]\n\t\t\tif(rev) {\n\t\t\t\t// go to that thing if it has a trivial url\n\t\t\t\twindow.history.pushState({},\"/\"+rev.path,\"/\"+rev.path)\n\t\t\t\treturn\n\t\t\t} else {\n\t\t\t\t// just go to the raw place\n\t\t\t\twindow.history.pushState({},\"/\"+blob,\"/\"+blob)\n\t\t\t\treturn\n\t\t\t}\n\t\t}\n\t\twindow.history.pushState({},\"/\",\"/\")\n\t}\n\n}\n\nwindow.router = new Router()\n\n\n\n//# sourceURL=webpack://sugarbase/./public/js/common/router.js?");

/***/ }),

/***/ "./public/js/components/nav_bar_component.js":
/*!***************************************************!*\
  !*** ./public/js/components/nav_bar_component.js ***!
  \***************************************************/
/***/ (() => {

eval("\nclass NavBarComponent extends HTMLElement {\n\n\tconstructor() {\n\t\tsuper()\n\t\twindow.appstate.observe(\"currentParty\",this.redraw.bind(this));\n\t}\n\n\tredraw() {\n\n\t\tlet party = window.appstate.currentParty ? \"party\" : \"login\"\n\n\t\tthis.style=\"width:100%;height:40px\"\n\t\tthis.innerHTML =\n\t\t\t`\n\t\t\t<div class='subpage' style=\"background:rgba(235,235,255,0.7);font-size:2em;\">\n\t\t\t\t<a href=\"/\">/Home</a>\n\t\t\t\t<a style=\"float:right\" href=\"/${party}\">${party}</a>\n\t\t\t</div>\n\t\t\t`\n\t}\n}\n\ncustomElements.define('nav-bar-component', NavBarComponent )\n\n\n\n//# sourceURL=webpack://sugarbase/./public/js/components/nav_bar_component.js?");

/***/ }),

/***/ "./public/js/custom_routes.js":
/*!************************************!*\
  !*** ./public/js/custom_routes.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_nav_bar_component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/nav_bar_component.js */ \"./public/js/components/nav_bar_component.js\");\n/* harmony import */ var _components_nav_bar_component_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_nav_bar_component_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _pages_splash_page_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/splash_page.js */ \"./public/js/pages/splash_page.js\");\n/* harmony import */ var _pages_splash_page_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_pages_splash_page_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _pages_party_home_page_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/party_home_page.js */ \"./public/js/pages/party_home_page.js\");\n/* harmony import */ var _pages_party_home_page_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_pages_party_home_page_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _pages_party_login_page_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/party_login_page.js */ \"./public/js/pages/party_login_page.js\");\n/* harmony import */ var _pages_party_login_page_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_pages_party_login_page_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _pages_party_signout_page_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/party_signout_page.js */ \"./public/js/pages/party_signout_page.js\");\n/* harmony import */ var _pages_party_signout_page_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_pages_party_signout_page_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _pages_generic_404_page_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/generic_404_page.js */ \"./public/js/pages/generic_404_page.js\");\n/* harmony import */ var _pages_generic_404_page_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_pages_generic_404_page_js__WEBPACK_IMPORTED_MODULE_5__);\n\n///\n/// Bind to your custom pages - in this example they look for window.router and attach themselves\n///\n\n\n\n\n\n\n\n\n///\n/// A handler for home page\n///\n\nrouter.use((segments)=>{\n\tif(segments && segments.length && segments[0].length) return 0\n\treturn \"splash-page\"\n\t//return window.appstate.currentParty ? \"party-home-page\" : \"splash-page\"\n})\n\n///\n/// A handler for single segment paths - these are stored as a list in the router itself optionally\n///\n\nrouter.use((segments)=>{\n\tif(!segments || segments.length != 1 || segments[0].length<1) return 0\n\tlet route = router.routes[segments[0]]\n\n\tif(!route) return 0\n\tif(route.condition && !route.condition()) return \"sugar-403-page\"\n\treturn route.elem\n})\n\n///\n/// add handler to handle fancier routes\n///\n///\t\t/party\n///\t\t/party/login\n///\t\t/party/logout\n///\n\nrouter.use(async (segments)=>{\n\n\tif(!segments || segments.length < 2 || segments[1].length<1) return 0\n\tlet slug = segments[0]\n\n\tif(slug!=\"party\") return 0\n\n\tlet command = segments[1]\n\n\tswitch(command) {\n\t\tcase \"login\": return \"party-login-page\"\n\t\tcase \"logout\":  // fall thru - (i prefer to differentiate login from logout by using the term signout)\n\t\tcase \"signout\": return \"party-signout-page\"\n\t\tdefault: break\n\t}\n\n\treturn 0\n})\n\n///\n/// error handling\n///\n\nrouter.use(async ()=> {\n\treturn \"generic-404-page\"\n})\n\n\n\n\n//# sourceURL=webpack://sugarbase/./public/js/custom_routes.js?");

/***/ }),

/***/ "./public/js/pages/generic_404_page.js":
/*!*********************************************!*\
  !*** ./public/js/pages/generic_404_page.js ***!
  \*********************************************/
/***/ (() => {

eval("class Generic404Page extends HTMLElement {\n\tconnectedCallback() {\n\t\tthis.innerHTML=`<img style=\"width:100%;height:100%;object-fit:cover\" src=\"/art/sad404.jpg\">`\n\t\t//setTimeout(()=>{ document.location = \"/\" },3000)\n\t}\n}\n\ncustomElements.define('generic-404-page', Generic404Page )\n\nrouter.add(\"404\", \"generic-404-page\")\n\n\n//# sourceURL=webpack://sugarbase/./public/js/pages/generic_404_page.js?");

/***/ }),

/***/ "./public/js/pages/party_home_page.js":
/*!********************************************!*\
  !*** ./public/js/pages/party_home_page.js ***!
  \********************************************/
/***/ (() => {

eval("\nclass PartyHomePage extends HTMLElement {\n\tcomponentWillShow() {\n\t\tthis.className=\"page\"\n\n\t\tlet moniker = window.appstate.currentParty ? window.appstate.currentParty.moniker : \"nobody!\"\n\n\t\tthis.innerHTML =\n\t\t\t`\n\t\t\t<div class='subpage' style=\"background:rgba(255,255,255,0.7);font-size:2em;\">\n\t\t\t\t<h1>You are logged in</h1>\n\t\t\t\t<br/>\n\t\t\t\tActions you may take here:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a href=\"/\">go to home page</a>\n\t\t\t\t\t<li><a href=\"/party\">go to your page</a>\n\t\t\t\t\t<li><a href=\"/party/signout\">go to signout</a>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t`\n\n\t\t// note: this page could look at the system state to determine if the user is logged in or not\n\t\t// note: this page could also choose to only paint itself on state changes\n\t}\n}\n\ncustomElements.define('party-home-page', PartyHomePage )\n\nrouter.add(\"party\", \"party-home-page\")\n\n\n\n//# sourceURL=webpack://sugarbase/./public/js/pages/party_home_page.js?");

/***/ }),

/***/ "./public/js/pages/party_login_page.js":
/*!*********************************************!*\
  !*** ./public/js/pages/party_login_page.js ***!
  \*********************************************/
/***/ (() => {

eval("\nclass PartyLoginPage extends HTMLElement {\n\tcomponentWillShow() {\n\t\tthis.className=\"page\"\n\t\tthis.innerHTML =\n\t\t\t`\n\t\t\t<div class='subpage' style=\"background:rgba(255,255,255,0.7);font-size:2em;\">\n\t\t\t\t<h1>You have been logged in</h1>\n\t\t\t\t<br/>\n\t\t\t\tActions you may take here:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a href=\"/\">go to home page</a>\n\t\t\t\t\t<li><a href=\"/party\">go to your page</a>\n\t\t\t\t\t<li><a href=\"/party/signout\">go to signout</a>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t`\n\t\twindow.appstate.login()\n\t}\n}\n\ncustomElements.define('party-login-page', PartyLoginPage )\n\nrouter.add(\"login\", \"party-login-page\")\n\n\n\n//# sourceURL=webpack://sugarbase/./public/js/pages/party_login_page.js?");

/***/ }),

/***/ "./public/js/pages/party_signout_page.js":
/*!***********************************************!*\
  !*** ./public/js/pages/party_signout_page.js ***!
  \***********************************************/
/***/ (() => {

eval("\nclass PartySignoutPage extends HTMLElement {\n\tcomponentWillShow() {\n\t\tthis.className=\"page\"\n\t\tthis.innerHTML =\n\t\t\t`\n\t\t\t<div class='subpage' style=\"background:rgba(255,255,255,0.7);font-size:2em;\">\n\t\t\t\t<h1>You have been signed out</h1>\n\t\t\t\t<br/>\n\t\t\t\tActions you may take here:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a href=\"/\">return to home page</a>\n\t\t\t\t\t<li><a href=\"/party/login\">go to login</a>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t`\n\n\t\twindow.appstate.signout()\n\t}\n}\n\ncustomElements.define('party-signout-page', PartySignoutPage )\n\nrouter.add(\"signout\", \"party-signout-page\")\n\n\n\n//# sourceURL=webpack://sugarbase/./public/js/pages/party_signout_page.js?");

/***/ }),

/***/ "./public/js/pages/splash_page.js":
/*!****************************************!*\
  !*** ./public/js/pages/splash_page.js ***!
  \****************************************/
/***/ (() => {

eval("\nclass SplashPage extends HTMLElement {\n\n\tconstructor() {\n\t\tsuper();\n\t\t// This is not a good place to paint your display due to limits in HTMLElement\n\t}\n\n\tcomponentWillShow() {\n\n\t\t// This is a special callback that the router invokes - it is a nice time to build your display\n\n\t\tthis.className=\"page\"\n\n\t\tlet moniker = window.appstate.currentParty ? window.appstate.currentParty.moniker : 0\n\n\t\tthis.innerHTML =\n\t\t\t`\n\t\t\t<div class='subpage' style=\"background:rgba(255,255,255,0.7);font-size:2em;\">\n\t\t\t\t<h1>Hello World!</h1>\n\t\t\t\t<br/>\n\t\t\t\tActions you may take here:\n\t\t\t\t<ul>\n\t\t\t\t\t<li style=\"display:${moniker?\"none\":\"normal\"}\"><a href=\"/party/login\">go to login</a>\n\t\t\t\t\t<li style=\"display:${moniker?\"normal\":\"none\"}\"><a href=\"/party\">go to your page</a>\n\t\t\t\t\t<li style=\"display:${moniker?\"normal\":\"none\"}\"><a href=\"/party/signout\">go to signout</a>\n\t\t\t\t</ul>\n\t\t\t\t<font color=\"white\">Login Status: ${moniker}</font>\n\t\t\t</div>\n\t\t\t`\n\t}\n\n\tconnectedCallback() {\n\t\t// The DOM will call this also and it is another way to paint your display\n\t}\n}\n\ncustomElements.define('splash-page', SplashPage )\n\nrouter.add(\"splash\", \"splash-page\")\n\n\n//# sourceURL=webpack://sugarbase/./public/js/pages/splash_page.js?");

/***/ }),

/***/ "./public/js/startup.js":
/*!******************************!*\
  !*** ./public/js/startup.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _business_logic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./business_logic.js */ \"./public/js/business_logic.js\");\n/* harmony import */ var _business_logic_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_business_logic_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _common_router_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/router.js */ \"./public/js/common/router.js\");\n/* harmony import */ var _custom_routes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./custom_routes.js */ \"./public/js/custom_routes.js\");\n\n///\n/// As a convention I tend to keep my business logic totally separate from layouts\n///\n\n\n\n///\n/// Bring in the router - it instances and binds itself to window.router\n///\n\n\n\n///\n/// Bring in all the app custom pages and all custom routes to chain to router.use()\n///\n\n\n\n///\n/// Startup everything once DOM has come to a rest\n///\n\nfunction startup() {\n\tdocument.body.appendChild(document.createElement(\"nav-bar-component\"))\n\n\t// force set this - usually like with firebase we would figure this out right away\n\twindow.appstate.currentParty = 0\n\n\twindow.router.reset()\n}\n\ndocument.addEventListener('DOMContentLoaded', startup );\n\n\n\n//# sourceURL=webpack://sugarbase/./public/js/startup.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/js/startup.js");
/******/ 	
/******/ })()
;