
///
/// An abstract base class with some helpful features
///

class SugarElement extends HTMLElement {

	constructor(props={},element_name=0,element_class=0) {

		// this is an optional custom elements registration helper - TODO improve
		if(element_name && element_class && !customElements.get(element_name)) {
			customElements.define(element_name, element_class)
		}

		// TODO return if done already on base

		// build html element
		super()

		// observe attributes
		// Note: this pattern is pretty mediocre: attributes can only be literals, are static, and cannot be set in constructor
		if(this.constructor.observedAttributes) {
			this.constructor.observedAttributes.forEach(key => {
				Object.defineProperty(this, key, {
					get() {
						return this.getAttribute(key)
					},
					set(value) {
						if (value) {
							this.setAttribute(key,value)
						} else {
							this.removeAttribute(value)
						}
					}
				})
			})
		}

		// set props - todo arguably could deep clone
		this.props = props

		// set to defaults only if props are not set and if defaults exist
		if(this.constructor.defaults) {
			Object.entries(this.constructor.defaults).forEach(([key,val])=>{
				// set default if prop not set
				if(props.hasOwnProperty(key)) {
					//this.props[key]=props[key]
				} else {
					this.props[key]=val
				}
			})
		}

		// attach observers if defaults exist
		if(this.constructor.defaults) {
			Object.entries(this.constructor.defaults).forEach(([key,val])=>{
				Object.defineProperty(this, key, {
					get() {
						return this.props[key]
					},
					set(value) {
						this.props[key]=value
						this.propChanged(key,value)
					}
				})
			})
		}

		// todo - could use a settimeout and then set the attributes
	}

	propChanged(key,value) {}
}

customElements.define('sugar-element', SugarElement )

window.SugarElement = SugarElement