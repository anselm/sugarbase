class Generic402Page extends HTMLElement {
	connectedCallback() {
		this.className="page"
		this.style="background:white;"
		this.innerHTML =
			`<div class='subpage'>
				<h2>Payment Required: 402</h2>
			</div>`
		//setTimeout(()=>{ document.location = "/" },3000)
	}
}

customElements.define('generic-402-page', Generic402Page )
