
///
/// As a convention I tend to keep my business logic totally separate from layouts
///

import './business_logic.js'

///
/// Bring in the router - it instances and binds itself to window.router
///

import './common/router.js'

///
/// Bring in all the app custom pages and all custom routes to chain to router.use()
///

import './custom_routes.js'

///
/// Startup everything once DOM has come to a rest
///

function startup() {
	document.body.appendChild(document.createElement("nav-bar-component"))

	// force set this - usually like with firebase we would figure this out right away
	window.appstate.currentParty = 0

	window.router.reset()
}

document.addEventListener('DOMContentLoaded', startup );

