
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

	// nav bar
	document.body.appendChild(document.createElement("nav-bar-component"))

	// start logic with a callback for login/logout events
	window.appstate.startup(()=>{

		// reset routing on login/logout
		window.router.reset()

	})
}

document.addEventListener('DOMContentLoaded', startup );


