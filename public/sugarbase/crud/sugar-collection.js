
///
/// Sugar Collection
///
///		- renders a change list from a dynamic collection - by calling db(job,query,callback)
///		- expects result.state to be "insert" or "remove"
///		- does paging by setting query.offset and query.limit in queries
///

export class SugarCollection extends SugarElement {

	static defaults = {
		observe: 0,
		query: {table:"party"},
		card: "sugar-card",
	}

	connectedCallback() {
		if(!this.observe) return
		if(this.job) console.warn("It's slightly unexpected to see this connected and disconnected more than once; is that your intent?")
		this.job = this.observe(this.job,this.query,this.insert.bind(this))
	}

	disconnectedCallback() {
		console.warn("disconnecting collection")
		this.job = this.observe(this.job)
	}

	insert(results) {

		// card to make
		let cardClass = customElements.get(this.card)
		if(!cardClass) throw "SugarCollection: style not found " + this.card

		// todo need to show mark and sweep behavior
		results.forEach(result => {
			let elem = this.querySelector(`[id='${result.id}']`)
			if(result.command=="delete") {
				if(elem) elem.remove()
			} else {
				if(!elem) {
					elem = new cardClass({artifact:result})
					elem.id = result.id
					this.prepend(elem)
				} else {
					elem.artifact = result
				}
			}
		})

	}

}

customElements.define('sugar-collection', SugarCollection ) 