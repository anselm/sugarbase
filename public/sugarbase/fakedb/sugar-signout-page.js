
///
/// Bare bones authentication example for a traditional name/password
/// The caller should inject properties .nextpage and .authenticate
///

export class SugarSignoutPage extends SugarElement {
	render() {
		if(!this.authenticate) throw "Authentication handler should be injected"
		let onclick = (e)=>{
			this.authenticate(0).then( (results)=>{
				window.history.pushState({},this.nextpage||"/",this.nextpage||"/")
			}).catch(err=>{
				// TODO redraw with error
			})
		}
		return htmlify`<sugar-page>
				<sugar-content>
					<h1>Click to sign out</h1>
					<button onclick=${onclick}>Sign Out</button>
				</sugar-content>
			</sugar-page>`
	}
}
SugarElement.register(SugarSignoutPage) // same as customElement.define
