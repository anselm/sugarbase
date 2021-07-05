
export class SugarInput extends HTMLInputElement {}
customElements.define('sugar-input', SugarInput, {extends:"input"} ) 

export class SugarTextArea extends HTMLInputElement {}
customElements.define('sugar-text-area', SugarTextArea, {extends:"textarea"} ) 


export class SugarForm extends SugarElement {

	static defaults = {
		width:"100%",
		height:"140px",
		subject:0,
		schema:0,
	}

// TODO - if this is missing then it is rendered multipletimes?
//	connectedCallback() {
//		if(!this.counter) this.counter = 0
//		this.counter = this.counter ? this.counter + 1 : 0
//		console.log("hmmm " + this.counter)
//	}

	render() {

		if(!this.hasOwnProperty("counter")) {
			this.counter = 0;
		} else {
			this.counter = this.counter + 1
		}

		console.log("rendering form " + this.counter + " random " + Math.random() + " what="+this.previous)
		this.previous = "what" + this.previous

		let subject = this.subject || {}
		let schema = this.schema
		if(!schema) {
			console.warn("no schema")
			return "nothing"
		}

		// TODO think about style management
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
			console.log(subject)
			await Services.db.post(subject)
			// TODO errorchecking
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
			let prev = subject[k]
			switch(v.rule) {
				case "id":
				case "hidden":
				case "string":
					contents.push(htmlify`<sugar-input is="input" class="sugar-input" id="${k}" oninput=${oninput} placeholder="${prev}"></sugar-input>`)
					break
				case "textarea":
					contents.push(htmlify`<sugar-text-area is="input" class="sugar-input" id="${k}" oninput=${oninput} placeholder="${prev}"></sugar-text-area>`)
					break
				case "image":
					break
				case "map":
					break
				case "date":
					break
				case "submit":
					contents.push(htmlify`<sugar-button id="${k}" onclick=${submit}>${v.value||k}</sugar-button>`)
					break
				case "remove":
					contents.push(htmlify`<sugar-button id="${k}" onclick=${remove}>${v.value||k}</sugar-button>`)
					break
				case "cancel":
					contents.push(htmlify`<sugar-button id="${k}" onclick=${cancel}>${v.value||k}</sugar-button>`)
					break
				default:
					break
			}
		})

		return contents

	}
}

customElements.define('sugar-form', SugarForm )



