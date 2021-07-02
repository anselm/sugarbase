
export class SugarInput extends HTMLInputElement {
	constructor() {
		super();
	}
	connectedCallback() {
	}
}
customElements.define('sugar-input', SugarInput, {extends:"input"} ) 

export class SugarForm extends SugarElement {

	static defaults = {
		artifact:{
			title:"nothing",
			image:"noimage"
		},
		width:"100%",
		height:"140px",
	}

	render() {

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
			background-image: url(${this.artifact.image});
			`

		// here is something being edited
		let artifact = {
			table:"event",
			title:"Amazing",
			image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/1920px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
			sponsor:1,
		}

		// test stuff

		let submit = (args) => {
			delete artifact.id
			Services.db.post(artifact)
		}

		let remove = () => {
			// 
		}

		let cancel = () => {
			//
		}

		let oninput = (e) => {
			artifact[e.target.id] = e.target.value
		}

		let form = {
			title:  {kind:"string",   value:"Walking on the Sun", oninput:oninput },
			url:    {kind:"string",   value:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/1920px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg"},
			image:  {kind:"image",    value:"" },
			map:    {kind:"map",      value:"" },
			descr:  {kind:"textarea", value:"" },
			start:  {kind:"date",     value:"" },
			end:    {kind:"date",     value:"" },
			submit: {kind:"button",   onclick:submit },
			remove: {kind:"button",   onclick:remove },
			cancel: {kind:"button",   onclick:cancel },
		}

		let contents = []
		Object.entries(form).forEach( ([k,v]) => {
			switch(v.kind) {
				case "string":
					contents.push(htmlify`<sugar-input is="input" class="sugar-input" id="${k}" oninput=${v.oninput} placeholder="${v.value}"></sugar-input>`)
					break
				case "image":
					break
				case "map":
					break
				case "textarea":
					contents.push(htmlify`<sugar-text id="${k}" placeholder="asdf"></sugar-text>`)
					break
				case "date":
					break
				case "button":
					contents.push(htmlify`<sugar-button id="${k}" onclick=${v.onclick}>${v.value||k}</sugar-button>`)
					break
				default:
					break
			}
		})

		return contents

	}
}

customElements.define('sugar-form', SugarForm )



