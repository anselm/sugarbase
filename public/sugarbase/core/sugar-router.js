
///
/// Router
///
/// A client side url based router; supply handlers with use()
/// - TODO make it into a component
///

export default class SugarRouter {

	///
	/// setup
	///

	constructor(buildstyle=true) {

		this.producedNames = {}
		this.debug = 1

		// intercept user navigation events - using our own _show() method
		window.addEventListener("popstate", (e) => {
			this._show(document.location.pathname,"pop")
		})

		// intercept user navigation events - monkey patch browser - using our own _show() method
		var previousPushState = history.pushState.bind(history)
		history.pushState = (state,path,origin) => {
			previousPushState(state,path,origin)
			this._show(path,"push")
		}

		// intercept all hyperlink clicks globally everywhere all the time
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
	/// A function to let users append their own route handling
	///

	push(handler) {
		if(!this.handlers) this.handlers = []
		this.handlers.push(handler)
		return this
	}

	///
	/// A function to let users prepend their own route handling
	///

	unshift(handler) {
		if(!this.handlers) this.handlers = []
		this.handlers.unshift(handler)
		return this
	}

	///
	/// Look up custom page in user supplied list of handlers to produce for an url
	///

	async _show(url=0) {

		// if no explicit name then look at current url for a name
		if(!url) url = location.pathname

		// remove hash
		url = url.split("#")[0]

		// skip past any noise at the start of the path
		if(url && url.startsWith("/")) url = url.substring(1)

		// get url as parts
		let segments = url.split("/")

		// throw away empty segments
		segments = segments.filter( (el) => { return el && el.length })


		// ask handlers about url and get back a hint
		let hint = 0
		for(let i = 0;hint==0 && i<this.handlers.length;i++) {
			hint = await this.handlers[i](segments)
		}

		// attempt to make element and attempt to glue to display
		this._make(hint,url)
	}

	_make(hint,url) {

		let kind = 0
		let inst = 0
		let args = {}

		// error
		if(!hint) {
			console.error("router: please supply a custom element name for this request where url=" + url)
			return
		}

		// hints can contain a few details
		if(hint instanceof Object && hint.donothing == true) {
			return
		} else if (typeof hint === 'string' || hint instanceof String) {
			kind = hint
		} else if(hint instanceof Object && hint.element) {
			kind = hint.element
			args = hint
		}

		// for each base url it's possible that there can be different clones of the same elements; look up by exact url
		// TODO may not wish to take all segments or may in some cases want to conserve memory space
		let code = url+kind
		if(this.producedNames[code]) {
			inst = this.producedNames[code]
			if(this.debug)console.warn("router: produced from cache " + code)
		}

		// else if custom element on this url is not found - try make it
		else if (typeof kind === 'string' || kind instanceof String) {
			if(this.debug)console.warn("router: has to produce from scratch " + kind)
			let c = customElements.get(kind)
			if(c) {
				// for now any special arguments are passed on the constructor to be helpful
				inst = new c(args)
			} else {
				// allow production of vanilla elements not managed by this system
				inst = document.createElement(kind)
			}
			if(!inst) {
				console.error("router: cannot produce " + kind)
				return
			}
			inst.id = code
			this.producedNames[code] = inst
		}

		// paranoia check
		if(!inst || !(inst instanceof Object)) {
			console.error("router: cannot produce " + url)
			return
		}

		// go out of our way to poke all the state back into the page - which may trigger repaints
		Object.entries(args).forEach( ([k,v]) => {
			if(this.debug)console.warn("router: passing advice " + k + " =" + v)
			inst[k]=v
		})

		// attach to display
		this._glue(inst)
	}

	async _glue(inst) {

		if(!inst) throw "Router: supply instance"

		// helpers to attempt to reduce flickering - another way would be to use mutation observers
		if(inst.componentWillShow) {
			await inst.componentWillShow()
		}

		// stay on same page?
		if(this.previous && this.previous.id == inst.id) {
			if(this.debug)console.warn("router: looks like we are going to the same place as we are at; do not reattach")
			return
		}

		// hide previous?
		if(this.previous) {
			if(this.debug)console.warn("router: looks like we are going to a new place; disconnect previous")
			this.previous.remove()
		}

		// remember previous
		this.previous = inst

		// the style of hide/show is to connect/disconnect - it seems to be robust and pages seem to be able to get their layout right
		document.body.appendChild(inst)
	}

	///
	/// go to current url in browser bar
	///

	reset() {
		this._show()
	}

/*
	///
	/// This is an approach that is more declarative - not used yet
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

}

export let router = new SugarRouter()

/*

///
/// a simple router - I've decided not to support this idea
///

export class SugarRouter extends HTMLElement {
	async connectedCallback() {

		router.routes = {}
		router.reverse = {}

		///
		/// a convenience concept - allow registration of simple routes
		///	supply a user path such as "settings" and the dom object to build and optional conditions
		/// kind is not actually used
		///

		router.add = (path,kind,condition=0) => {
			if(!path || !kind || !path.length || !kind.length) return
			this.routes[path] = this.reverse[kind] = { path:path, kind:kind, condition:condition }
		}

		router.inject = (inst,kind,url)=> {
			// inject existing instance to router; each separate url version of an instance gets its own slot
			let code = url+kind
			inst.id = code 
			this.producedNames[code] = inst
		}


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

