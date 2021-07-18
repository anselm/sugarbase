
///
/// Sugar Collection
///
///		- renders a change list from a dynamic collection - by calling db(job,query,callback)
///		- expects result.state to be "insert" or "remove"
///		- does paging by setting query.offset and query.limit in queries
///

let counter = 124

export class SugarCollection extends SugarElement {

	constructor() {
		super()
		this.counter = counter ; counter += 10
		console.log("sugar-collection constructor called " + this.counter)
	}

	static defaults = {
		observe: 0,
		query: 0,
		card: "sugar-card",
	}

	connectedCallback() {
		console.log(this.counter)
		console.log(this.card)
		console.log(this.query)
		console.log(this.observe)
		if(!this.observe) throw "Must supply database observer"
		if(this.job) console.warn("It's slightly unexpected to see this connected and disconnected more than once; is that your intent?")
		this.job = this.observe(this.job,this.query,this.insert.bind(this))
	}

	disconnectedCallback() {
		console.warn("disconnecting collection")
		if(this.observe) this.job = this.observe(this.job)
	}

	insert(results) {

		// card to make
		let cardClass = customElements.get(this.card)
		if(!cardClass) throw "SugarCollection: style not found " + this.card

console.log(results)

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
console.log("found change")
					elem.remove()
					elem = new cardClass({artifact:result})
					elem.id = result.id
					this.prepend(elem)
				}
			}
		})

	}

}

customElements.define('sugar-collection', SugarCollection ) 
