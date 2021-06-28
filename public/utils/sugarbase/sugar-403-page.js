class Sugar403Page extends HTMLElement {
	connectedCallback() {
		this.className="page"
		this.style="background:white;"
		this.innerHTML =
			`<div class='subpage'>
				<h2>Not Authorized: 403</h2>
			</div>`
		//setTimeout(()=>{ document.location = "/" },3000)
	}
}

customElements.define('sugar-403-page', Sugar403Page )
