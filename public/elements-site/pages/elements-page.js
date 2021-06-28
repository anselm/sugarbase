
import '/utils/sugarbase/sugar-collection.js'

class ElementsPage extends HTMLElement {

	connectedCallback() {

		this.className="sugar-page"
		this.innerHTML =
			`<div class='sugar-content'>
				<sugar-collection></sugar-collection>
			</div>`

		let node = this.querySelector("sugar-collection");

		node.results = [
			{ id:1,title:"test" },
			{ id:2,title:"tests" },
			{ id:3,title:"testb" },
		]

		node.results = [
			{ id:4,title:"test" },
			{ id:6,title:"tests" },
			{ id:7,title:"testb" },
		]

	}
}
customElements.define('elements-page', ElementsPage )

