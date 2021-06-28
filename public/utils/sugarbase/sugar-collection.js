
import "./sugar-element.js"

export class SugarCollection extends SugarElement {

	// SugarElement will build getters and setters if you do this
	static defaults = {
		results: "test"
	}

	// Otherwise you can just declare variables at will without change events
	// results = [];

	connectedCallback() {
		this.render()
	}

	disconnectedCallback() {
	}

	propChanged(name) {
		// up to you do do whatever you want here
		this.render();
	}

	render() {

		if(!this.results) return

// todo need to show mark and sweep behavior

		this.results.forEach(result => {
			let elem = this.querySelector(`[id='${result.id}']`)
			if(result.command=="delete") {
				if(elem) elem.remove()
			} else {
				if(!elem) {
					elem = document.createElement("div")
					elem.innerHTML=result.title + result.id
					elem.id = result.id
					elem.style="border:3px solid red;padding:4px;margin:4px;width:100%"
					this.append(elem)
				}
				elem.value = result
			}
		})

	}

}

customElements.define('sugar-collection', SugarCollection ) 
