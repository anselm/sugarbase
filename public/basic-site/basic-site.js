
// bring in an element helper
import '/sugarbase/elements/sugar-element.js'

// build an example element
export class BasicElement extends SugarElement {
	static defaults = { title:"See not 🙈" }
	render() {
		console.log("render is being called with " + this.title)
		return htmlify`Monkey says: ${this.title}`
	}
}
customElements.define('basic-element', BasicElement )

// perform a raw layout right now to the display
export function run() {
	htmlify2dom(document.body,
		htmlify`
			<link type="text/css" rel="stylesheet" href="/sugarbase/style/sugar-mobile.css" />
			<sugar-page>
				<sugar-content>
					<basic-element>This is outside the render() scope: Hear Not 🙉</basic-element>
				</sugar-content>
			</sugar-page`,
	)
	let elem = document.body.querySelector('basic-element')
	elem.title = "Speak not 🙊"
}

// do simple tags work?