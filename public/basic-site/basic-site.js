
document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="/basic-site/basic-mobile.css">`
document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="/basic-site/basic-forms-large.css">`

import './sugar-element.js'

class BasicElement extends SugarElement {
	static defaults = {
		title:"🙈"
	}
	constructor(props) {
		super(props,'basic-element',BasicElement)
	}
	connectedCallback() {
		console.log("BasicElement is being asked to paint display with title="+this.title)
		this.style = "sugar-page"
		this.innerHTML += this.title
	}
}

export function run() {
	let elem = new BasicElement({title:"🙉"})
	document.body.append( new BasicElement() )
	elem.title = "🙊"
}