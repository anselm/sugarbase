
///
/// bring in an html tagged template parser function and something to actually build html
///

import {htmlify,htmlify2dom} from '../htmlify.js'

//export htmlify
//export htmlify2dom

///
/// Extends HTMLElement with observers
///

export class SugarElement extends HTMLElement {

	constructor(props={}) {

		// build super class
		super()

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

		// sugar uses an idea of 'defaults' which it will observe and signal upwards
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

		// set props - todo arguably could deep clone
		this.props = props || {}

		// set to defaults only if props are not set and if defaults exist
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

		// todo - could use a settimeout and then set the attributes
	}

	//////////////////////////////////////////////////// events

	propChanged(key,value) {
		// for now permit subclassing and then avoids updating if desired
		this.repaint()
	}

	/////////////////////////////////////////////////// lifecycle

	connectedCallback() {
		if(!this._hasBeenCalledOnce) {
			this._hasBeenCalledOnce = true
			if(this.connectedFirstTime) {
				this.connectedFirstTime()
			}
			if(this.renderOnce) {
				htmlify2dom(this,this.renderOnce(),true)
			}
		}
		this.repaint()
	}

	repaint() {
		if(!this.render) return
		htmlify2dom(this,this.render(),true)
	}

}

customElements.define('sugar-element', SugarElement )

// make it globally available
window.SugarElement = SugarElement


