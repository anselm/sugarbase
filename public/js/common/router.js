
///
/// Router
///
/// A client side url based router; supply handlers with use()
///

export class Router {

	///
	/// go to current url in browser bar
	///

	reset() {
		this._show()
	}

	///
	/// setup
	///

	constructor() {

		// a list of handlers
		this.routes = {}
		this.reverse = {}

		// watch user navigation events
		window.addEventListener("popstate", (e) => {
			this._show(document.location.pathname,"pop")
		})

		// watch user navigation events - monkey patch browser
		var previousPushState = history.pushState.bind(history)
		history.pushState = (state,path,origin) => {
			previousPushState(state,path,origin)
			this._show(path,"push")
		}

		// catch all hrefs globally everywhere all the time
		document.addEventListener('click', function (event) {

			if(event.target.type == "file") return true

			// find actual href somewhere around here
			var target = event.target || event.srcElement;
			while (target) {
				if (target instanceof HTMLAnchorElement) break
				target = target.parentNode
			}

			// get at the raw value that was set - not the one that is magically made by some wrapper
			let raw = target ? target.getAttribute("href") : 0 // target.href is "produced" by some weird wrapper

			// this router is only interested in specific urls that exist and that route locally
			if(!raw || !raw.length || raw.startsWith("http")) {
				return true
			}

			// stop anything else
			event.preventDefault()

			// get the local fragment
			let path = (new URL(target.href)).pathname

			// force transition here
			history.pushState({},path,path)

			// stop propagation also (may not be needed)
			return false

		}, false)

	}

	///
	/// Add a handler to the list of handlers to try to resolve a url change
	///

	use(handler) {
		if(!this.handlers) this.handlers = []
		this.handlers.push(handler)
		return this
	}

	///
	/// Show the right page for a url
	///

	async _show(url=0) {

		// if no explicit name then look at current url
		if(!url) url = location.pathname

		// remove hash
		url = url.split("#")[0]

		// skip past any noise at the start of the path
		if(url && url.startsWith("/")) url = url.substring(1)

		// get url as parts
		let segments = url.split("/")

		let classIdentifier = 0

		// ask handlers about url and get back a named dom element
		for(let i = 0;classIdentifier==0 && i<this.handlers.length;i++) {
			classIdentifier = await this.handlers[i](segments)
		}

		// error
		if(!classIdentifier) {
			console.error("Router: bad handler name=" + url)
			return 0
		}

		// make dom element
		let elem = this._make(classIdentifier,url)

		if(!elem) {
			console.error("Router: could not resolve name=" + url)
			return
		}

		// attach to display
		this._glue(elem)
	}

	_make(classIdentifier,url) {

		// remember
		if(!this.producedClasses) {
			this.producedClasses = {}
			this.producedNames = {}
		}

		let elem = 0

		// if an object is supplied then use as is
		//if(typeof classIdentifier === 'object') {
		//	elem = classIdentifier
		//}

		// if this url was visited use previous
		let code = url+classIdentifier
		if(this.producedNames[code]) {
			elem = this.producedNames[code]
		}

		// else if is a string then try make
		else if (typeof classIdentifier === 'string' || classIdentifier instanceof String) {
			if(this.producedClasses[classIdentifier]) {
				elem = this.producedClasses[classIdentifier]
			} else {
				elem = document.createElement(classIdentifier)
				if(!elem) {
					console.error("Router: cannot make " + classIdentifier)
					return 0
				}
				if(elem) {
					elem.id = code
					//elem.classList.add("hidden") <- must not hide because it messes up initial layouts
					this.producedNames[code] = elem
					this.producedClasses[classIdentifier] = elem
					document.body.appendChild(elem)
				}
			}
		}

		return elem
	}

	_glue(elem) {

		// another way was to hide all... 

		// hide previous?
		if(this.previous) {
			if(elem && this.previous.id == elem.id) {
				// hmm, is self... do nothing i guess?
			} else {
				this.previous.classList.add("hidden")
				this.previous.hidden = true
				if(this.previous.componentDidHide instanceof Function) {
					this.previous.componentDidHide()
				}
			}
		}

		// remember previous
		this.previous = elem

		// this is disabled; basically if an item is reshown and it visible then the component will be advised anyway
		//if(elem.hidden==false) {
		//	choose to do nothing here
		//}

		// call a helper that lets the page repaint itself as it wishes - a promise here helps reduce flickering

		if(elem.componentWillShow) {
			let promise = elem.componentWillShow()
			if(promise) {
				promise.then( () => {
					elem.classList.remove("hidden")
					elem.hidden = false
				})
			} else {
				elem.classList.remove("hidden")
				elem.hidden = false
			}
		} else {
			elem.classList.remove("hidden")
			elem.hidden = false
		}


	}

	///
	/// sugar specific convenience concept - allow registration of simple routes
	///	supply a user path such as "settings" and the dom object to build and optional conditions
	///

	add(path,elem,condition=0) {
		if(!path || !elem || !path.length || !elem.length) return
		this.routes[path] = this.reverse[elem] = { path:path, elem:elem, condition:condition }
	}

	///
	/// given some kind of string or target - go to it
	///

	goto(blob=null,command=0) {
		if(blob && typeof blob === 'string') {
			// got to named element
			let rev = router.reverse[blob]
			if(rev) {
				// go to that thing if it has a trivial url
				window.history.pushState({},"/"+rev.path,"/"+rev.path)
				return
			} else {
				// just go to the raw place
				window.history.pushState({},"/"+blob,"/"+blob)
				return
			}
		}
		window.history.pushState({},"/","/")
	}

}

window.router = new Router()

