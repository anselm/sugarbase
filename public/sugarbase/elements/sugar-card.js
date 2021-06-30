export class SugarCard extends SugarElement {

	static defaults = {
		artifact:{title:"nothing",image:"noimage"},
		width:"100%",
		height:"140px",
	}

	connectedCallback() {

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

		let p_style = `margin:4px`

		this.innerHTML =
			`<a href="/">
			<div style="${inner_div_style}"></div>
			</a>
			<p style="${p_style}"> ${this.artifact.title}</p>
			`
	}
}

customElements.define('sugar-card', SugarCard )

