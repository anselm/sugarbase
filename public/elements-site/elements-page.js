
///
/// This is a full blown page that has some other elements in it - namely a collection - that itself has cards
///

class ElementsPage extends HTMLElement {

	connectedCallback() {

		// I'm choosing to never flush the view
		if(this.latched) return
		this.latched = 1

		// write to dom now
		this.className="sugar-page"
		this.innerHTML =
			`<div class="sugar-page">
				<div class='sugar-content'>
					<sugar-collection></sugar-collection>
				</div>
			</div>`

		// get a grip on the collection
		let node = this.querySelector("sugar-collection")

		// pass changes to collection; allowing us to manage the collection without specializing it
		this.job = Services.observe(this.job,{table:"event"},(results)=>{
			node.results = results
		})
	}

	disconnectedCallback() {
		// this.job = Services.observe(this.job)
	}
}
customElements.define('elements-page', ElementsPage )
