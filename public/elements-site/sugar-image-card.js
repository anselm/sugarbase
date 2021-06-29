export class SugarImageCard extends SugarElement {

	static defaults = {
		artifact:{title:"nothing",image:"noimage"},
		width:"100%",
		height:"100px",
		paragraph_margin:"4px",
		outer_margin:"20px",
		shadow:"3px 3px 10px 0 rgba(0,0,0,0.35);"
	}

	connectedCallback() {

		this.style=`
			box-shadow:${this.shadow};
			margin:${this.outer_margin};
			display:block
			`
		let inner_div_style=`
			background-position: center center;
			background-repeat: no-repeat;
			background-size: cover;
			background-color: hsl(${360*Math.random()},${25+70*Math.random()}%,${85+10*Math.random()}%);
			background-image: url(${this.artifact.image});
			width:${this.width};
			height:${this.height};
			`

		this.innerHTML =
			`<a href="/">
				<div style="${inner_div_style}">
				</div>
			</a>
			<p style="margin:${this.margin}">${this.artifact.title}</p>
			`
	}
}

customElements.define('sugar-image-card', SugarImageCard )








