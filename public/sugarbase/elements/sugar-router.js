
///
/// Router
///
/// A client side url based router; supply handlers with use()
/// - TODO make it into a component
///

export default class SugarRouter extends HTMLElement {

	static new() {
		return new Router();
	}

	///
	/// go to current url in browser bar
	///

	reset() {
		this._show()
	}

	///
	/// setup
	///

	constructor(buildstyle=true) {
		super()

		this.producedClasses = {}
		this.producedNames = {}

		this.routes = {}
		this.reverse = {}

		// this is the way that pages are hidden or shown
		// pages typically are built after this is installed so there shouldn't be any flickering
		//if(buildstyle) {
		//	var style = document.createElement('style');
		//	style.type = 'text/css';
		//	style.innerHTML = '.hidden { display: none; }';
		//	document.getElementsByTagName('head')[0].appendChild(style);
		//}

		// watch user navigation events
		window.addEventListener("popstate", (e) => {

console.log("user popped " + document.location.pathname)

			this._show(document.location.pathname,"pop")
		})

		// watch user navigation events - monkey patch browser
		var previousPushState = history.pushState.bind(history)
		history.pushState = (state,path,origin) => {

console.log("user pushed " + document.location.pathname)
console.log(state)
console.log(path)

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
	/// Append a handler to the list of handlers to try to resolve a url change
	///

	push(handler) {
		if(!this.handlers) this.handlers = []
		this.handlers.push(handler)
		return this
	}

	///
	/// Prepend a handler to the list of handlers to try to resolve a url change
	///

	unshift(handler) {
		if(!this.handlers) this.handlers = []
		this.handlers.unshift(handler)
		return this
	}

/*
	///
	/// This is an approach that is more declarative
	///

	bundle(data) {

		let bundle_handler = () => {
			Object.entries(data).forEach( ([k,v]) => {
				console.log(k)
				console.log(v)
				if(v.condition) {
					let results = v.condition(segments)
					// deal with "do soemthing else"
					//if good then use the element ... pass it the args
				} else if(path match) {
					// same
				}
			})
		}

		this.handlers.push(bundle_handler)

	}
*/

	///
	/// Show the right page for a url
	///

	async _show(url=0) {

console.log("being asked to show a page " + url)

		// if no explicit name then look at current url
		if(!url) url = location.pathname

		// remove hash
		url = url.split("#")[0]

		// skip past any noise at the start of the path
		if(url && url.startsWith("/")) url = url.substring(1)

		// get url as parts
		let segments = url.split("/")

		let hint = 0

		// ask handlers about url and get back a named dom element
		for(let i = 0;hint==0 && i<this.handlers.length;i++) {
			hint = await this.handlers[i](segments)
		}

		// error
		if(!hint) {
			console.error("Router: bad handler name=" + url)
			return 0
		}

		// make dom element
		let inst = this._make(hint,url)

		if(!inst) {
			console.error("Router: could not resolve name=" + url)
			return
		}

		// attach to display
		this._glue(inst)
	}

	inject(inst,kind,url) {
		// inject existing instance to router; each separate url version of an instance gets its own slot
		let code = url+kind
		inst.id = code 
		this.producedNames[code] = inst
		this.producedClasses[kind] = inst
	}

	_make(hint,url) {

		let kind = 0
		let inst = 0
		let args = {}

		// various "flavors" of can be built

		if (typeof hint === 'string' || hint instanceof String) {
			kind = hint
		}
		else if(hint instanceof Object && hint.element) {
			kind = hint.element
			args = hint
		}

		// if an object is supplied then use as is
		//if(typeof classIdentifier === 'object') {
		//	inst = classIdentifier
		//}

		// if this url was visited use previous exact variation instance
		let code = url+kind
		if(this.producedNames[code]) {
			inst = this.producedNames[code]
		}

		// else if is a string then try make
		// TODO it is arguable I may want more than one copy of a given produced class based on url
		else if (typeof kind === 'string' || kind instanceof String) {
			if(this.producedClasses[kind]) {
				inst = this.producedClasses[kind]
			} else {
				let c = customElements.get(kind)
				if(c) {
					inst = new c(args)
				} else {
					inst = document.createElement(kind)
				}
				if(!inst) {
					console.error("Router: cannot make " + kind)
					return 0
				}
				if(inst) {
					inst.id = code
					//inst.classList.add("hidden") <- must not hide because it messes up initial layouts!
					//this.producedNames[code] = inst
					//this.producedClasses[kind] = inst
					//document.body.appendChild(inst) <- lets defer adding till needed
				}
			}
		}

		return inst
	}

	_glue(inst) {


console.log("gluing to display")
console.log(inst)

		if(this.previous) {
			if(inst && this.previous.id == inst.id) {
				// if we are switching to the same object and same url then do nothing - it is already visible
			} else {
				// otherwise hide previous and then notify
				this.previous.remove()
				//this.previous.classList.add("hidden")
				//this.previous.hidden = true
				//if(this.previous.componentDidHide instanceof Function) {
				//	this.previous.componentDidHide()
				//}
			}
		}

		// remember previous
		this.previous = inst

		// advise component that it is about to be re-displayed - this reduces flickering
		// TODO perhaps there is a way to avoid this? mutations could also do it

		if(inst.componentWillShow) {
			let promise = inst.componentWillShow()
			if(promise) {
				promise.then( () => {
					//inst.classList.remove("hidden")
					//inst.hidden = false
					document.body.appendChild(inst)
				})
			} else {
				//inst.classList.remove("hidden")
				//inst.hidden = false
				document.body.appendChild(inst)
			}
		} else {
			//inst.classList.remove("hidden")
			//inst.hidden = false
			document.body.appendChild(inst)
		}

		// hammer on connected callback again TODO sloppy <- obsolete now
		//if(!inst.connectedCallback) {
		//	console.log(inst)
		//	alert("no callback")
		//}
		//inst.connectedCallback()

	}

	///
	/// a convenience concept - allow registration of simple routes
	///	supply a user path such as "settings" and the dom object to build and optional conditions
	/// kind is not actually used
	///

	add(path,kind,condition=0) {
		if(!path || !kind || !path.length || !kind.length) return
		this.routes[path] = this.reverse[kind] = { path:path, kind:kind, condition:condition }
	}

	///
	/// convenience concept for simple routes
	/// given some kind of string or target - go to it now
	/// this is discouraged - better to just directly write to the window state
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

	connectedCallback() {
		this.push(this.user_router)
		this.reset()
	}

}

customElements.define('sugar-router', SugarRouter )

export let router = new SugarRouter()

/*

///
/// a simple router - I've decided not to support this idea
///

export class SugarRouter extends HTMLElement {
	async connectedCallback() {

		let router = new Router()

		await import ('./generic-404-page.js')

		// inject existing elements as simple paths
		for(let i = 0; i < this.children.length;i++) {
			let inst = this.children[i]
			let kind = inst.tagName.toLowerCase()
			let path = inst.path
			router.inject(inst,name,inst.path)
			router.add(path,kind)
			inst.classList.add("hidden") // TODO sloppy
			inst.hidden = true
			console.log(inst)
			inst.remove()
			inst.innerHTML = "asdf"
		}

		// first one is default
		if(this.children.length) {
			let kind = this.children[0].tagName.toLowerCase()
			// for zero length urls return this kind
			router.append((segments)=>{
				if(segments && segments.length && segments[0].length) return 0
				return kind;
			})
		}

		// rest will route as needed by simple paths if found
		router.append((segments)=>{
			if(!segments || segments.length != 1 || segments[0].length<1) return 0
			let route = router.routes[segments[0]]
			if(!route) return 0
			return route.kind
		})

		// error handler
		router.append(()=> {
			return "generic-404-page"
		})

		// start system
		router.reset()
	}
}


*/

