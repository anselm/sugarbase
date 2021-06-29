
///
/// This is a moderately generic collection view
///		- it shows an image card by default
///		- it will eventually have paging
///		- it doesn't know about a database; a parent spoon feeds it
///		- it should be a bit smarter to do state changes like deletes
///		- it can remain in sync with a server depending how it is spoon fed
///

export class SugarCollection extends SugarElement {

	static defaults = {
		results: [],
		card: "sugar-image-card",
	}

	connectedCallback() {
		this.render()
	}

	disconnectedCallback() {
	}

	propChanged(name,val) {
		this.render();
	}

	render() {

		if(!this.results) return

		// make a pile of these on demand
		let cardClass = customElements.get(this.card || "sugar-image-card")
		if(!cardClass) throw "Card Class not found"

		// todo need to show mark and sweep behavior
		this.results.forEach(result => {
			let elem = this.querySelector(`[id='${result.id}']`)
			if(result.command=="delete") {
				if(elem) elem.remove()
			} else {
				if(!elem) {
					elem = new cardClass({artifact:result})
					elem.id = result.id
					this.append(elem)
				} else {
					elem.artifact = result
				}
			}
		})

	}

}

customElements.define('sugar-collection', SugarCollection ) 
