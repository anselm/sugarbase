
export class SugarInput extends HTMLInputElement {}
customElements.define('sugar-input', SugarInput, {extends:"input"} ) 

export class SugarTextArea extends HTMLInputElement {}
customElements.define('sugar-text-area', SugarTextArea, {extends:"textarea"} ) 


export class SugarForm extends SugarElement {

	static defaults = {
		width:"100%",
		height:"140px", // TODO image height - think about where this should be - think about CSS
		subject:0,
		schema:0,
	}

	render() {

// DEBUGGING
		if(!this.hasOwnProperty("counter")) {
			this.counter = 0;
		} else {
			this.counter = this.counter + 1
		}
		console.log("rendering form " + this.counter + " random " + Math.random() + " what="+this.previous)
		this.previous = "what" + this.previous

		// use supplied schema?
		let subject = this.subject || {}
		let schema = this.schema
		if(!schema) {
			console.warn("no schema")
			return "nothing"
		}

		// TODO think about style management - move this out of here
		this.style=`
			box-shadow: 3px 3px 10px 0 rgba(0,0,0,0.35);
			margin-top: 10px;
			margin-bottom: 10px;
			display:block;
			`

		let inner_div_style=`
			width:${this.width};
			height:${this.height};
			background-position: center center;
			background-repeat: no-repeat;
			background-size: cover;
			background-color: hsl(${360*Math.random()},${25+70*Math.random()}%,${85+10*Math.random()}%);
			background-image: url(${schema.image});
			`

		let submit = async (args) => {
			console.log("***** Saving subject as is to DB")
			console.log(subject)
			// TODO client side db post should do a ton of error checking and then server should also
			let result = await Services.db.post(subject)
			// TODO errorchecking on result here as well
			// TODO go to the right place also... like probably the real thing
			console.log(result)
			window.history.pushState({},"/groups","/groups")
		}

		let remove = () => {
			// 
		}

		let cancel = () => {
			//
		}

		let oninput = (e) => {
			subject[e.target.id] = e.target.value
		}

		let contents = []
		Object.entries(this.schema).forEach( ([k,v]) => {
			let prev = subject[k] || ""
			switch(v.rule) {
				case "id":
				case "hidden":
					break
				case "string":
					contents.push(htmlify`<p>${v.label}</p><input is="input" class="sugar-input" id="${k}" oninput=${oninput} value="${prev}" placeholder="${prev||""}"></input>`)
					break
				case "textarea":
					contents.push(htmlify`<p>${v.label}</p><text-area is="input" class="sugar-input" id="${k}" oninput=${oninput} value="${prev}" placeholder="${prev||""}"></text-area>`)
					break
				case "image":
					contents.push(htmlify`<p>${v.label}</p><input is="input" class="sugar-input" id="${k}" oninput=${oninput} value="${prev}" placeholder="${prev||""}"></input>`)
					break
				case "map":
					break
				case "date":
					break
				case "submit":
					contents.push(htmlify`<button id="${k}" onclick=${submit}>${v.value||k}</button>`)
					break
				case "remove":
					contents.push(htmlify`<button id="${k}" onclick=${remove}>${v.value||k}</button>`)
					break
				case "cancel":
					contents.push(htmlify`<button id="${k}" onclick=${cancel}>${v.value||k}</button>`)
					break
				default:
					break
			}
		})

		return contents

	}
}

customElements.define('sugar-form', SugarForm )



