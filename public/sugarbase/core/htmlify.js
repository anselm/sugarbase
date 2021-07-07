
//
// use this nice string to jsx converter
//

import htm from './htm.js' // https://unpkg.com/htm?module'

///
/// htmlify is a function to turn a template tagged string into a jsx node graph
///

function h(type, props, ...children) { return { type, props, children }; }
export const htmlify = htm.bind(h)

window.htmlify = htmlify

///
/// turn a jsx node graph into nodes on the dom
///
///		- todo should deal with css and other kinds of imports
///		- should improve dealing with onclick and stuff - think it through
///		- decide if i want to support attributes in any special way
///

export function htmlify2dom(parent=0,node,flush=false) {

	if (!node) {
		console.warn("empty htmlify")
		return
//		throw "illegal node"
	}

	// flush?
	if(flush && parent) {
		parent.innerHTML = ""
	}

	// it is ok to pass a string (note that raw content bypasses the whole render/callback/update system of sugar)
	if (typeof node === 'string' || node instanceof String) {
		let n2 = document.createElement('text')
		n2.innerText = node
		if(parent) parent.append(n2)
		return n2
	}

	// it is ok to pass an array of candidates
	if(Array.isArray(node)) {
		let group = document.createElement('div')
		node.forEach(child=>{
			if(!child) {
				console.warn("Child is empty on array")
			} else {
				let thing = htmlify2dom(group,child)
			}
		})
		if(parent) parent.append(group)
		return group
	}

	let elem = 0

	// magick a way a couple of types
	if(node.type == "text/css") node.type = "style"

	// magic our way around having to define custom elements
//	if(node.type.includes("-") && !customElements.get(node.type)) {
//		console.log("noticed " + node.type)
//	}

	// magick "is" properties
	if(node.props && node.props.is) {
		elem = document.createElement(node.props.is, {is:node.type})
	} else {
		elem = document.createElement(node.type)
	}

	// specially set the class name right now from any discovery that the jsx parser made
	if(node.props && node.props.class) elem.className = node.props.class

	// copy user desired props into the dom node - to support ordinary dom node behavior - note sugar-element intercepts the ones specified by user in state config
	if(node.props) {
		Object.entries(node.props).forEach(([k,v]) => {
			elem[k]=v
		})
	}

	// convert children
	if(node.children) {
		node.children.forEach(child=>{
			if (child == null) {
			} else if (typeof child === 'string' || child instanceof String) {
				elem.innerHTML += child
			} if(typeof child === 'object' && child.type) {
				htmlify2dom(elem,child)
			}
		})
	}

	if(parent) parent.append(elem)

	return elem
}

window.htmlify2dom = htmlify2dom
