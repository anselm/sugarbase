
///
/// bring in an html tagged template parser function and something to actually build html
///

import {htmlify,htmlify2dom} from './htmlify.js'

//export htmlify
//export htmlify2dom

///
/// Extends HTMLElement with observers
///

export class SugarElement extends HTMLElement {

	constructor(props={}) {

		// build super class
		super()

		this.debug = 1

		let elem = this

		// as a convenience, promote setAttribute("myattribute") to this.myattribute = "123"
		if(elem.constructor.observedAttributes) {
			elem.constructor.observedAttributes.forEach(key => {
				Object.defineProperty(elem, key, {
					get() {
						return elem.getAttribute(key)
					},
					set(value) {
						if (value) {
							elem.setAttribute(key,value)
						} else {
							elem.removeAttribute(value)
						}
					}
				})
			})
		}

		// keep a reference to a copy of ALL the raw properties passed to this entity
		this.props = {...props} || {}

		// for properties that are ALSO in defaults, set them to defaults UNLESS supplied
		if(this.constructor.defaults) {
			Object.entries(this.constructor.defaults).forEach(([key,val])=>{
				// set default if prop not set
				if(props.hasOwnProperty(key)) {
					this.props[key]=props[key]
				} else {
					this.props[key]=val
				}
			})
		}

		// for all defaults specifically create getters and setters directly on base - but ONLY on defaults (because they trigger a repaint)
		if(this.constructor.defaults) {
			Object.entries(this.constructor.defaults).forEach(([key,val])=>{
				Object.defineProperty(elem, key, {
					get() {
						return elem.props[key]
					},
					set(value) {
						elem.props[key]=value
						if(elem.propChanged) elem.propChanged(key,value)
					}
				})
			})
		}

		// todo - could use a settimeout and then set the attributes - otherwise due to custom element design limits it is not possible to set these
	}

	//////////////////////////////////////////////////// events

	propChanged(key,value) {
		// subclass this if you want to stop auto-updating - TODO think of nicer ways; such as bundles of changes?
		if(this.debug) console.warn("sugar-element: type=" + this.constructor.name + " prop change key=" + key + " value=" + value)
		this.rerender()
	}

	/////////////////////////////////////////////////// lifecycle

	connectedCallback() {
		if(!this._hasBeenCalledOnce) {
			this._hasBeenCalledOnce = true
			if(this.connectedFirstTime) {
				this.connectedFirstTime()
			}
			if(this.renderOnce) {
				if(this.debug) console.warn("sugar-element: calling special render once")
				htmlify2dom(this,this.renderOnce(),true)
				return
			}
		}
		this.connected = this.connected ? this.connected + 1 : 1
		if(this.debug) console.warn("sugar-element: connected thing ... " + this.constructor.name + " iteration=" + this.connected)
		this.rerender()
	}

	rerender() {
		if(!this.render || !this.isConnected) return
		if(this.debug) console.warn("sugar-element: rerender() called... (may be first render or a force update notification) for "  + this.constructor.name)
		htmlify2dom(this,this.render(),true)
	}

	/////////////////////////////////////////////////////////// register helper

	static register(c,str=0) {
		// TODO is there any use case for remembering classes here? for routing or other use cases?
		// TODO is it worth it to inject htmlelement into these? rather than having caller extend class?
		if(!str) {
			let parts = c.name.match(/[A-Z][a-z]+/g)
			str = parts.join("-").toLowerCase()
		}
		if(!customElements.get(str)) {
			customElements.define(str,c)
		}
	}

}

customElements.define('sugar-element', SugarElement )

// make it globally available
window.SugarElement = SugarElement


