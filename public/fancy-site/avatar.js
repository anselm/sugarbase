

export class AvatarPage extends SugarElement {
	render() {
		if(this.latch) return
		this.latch = 1

// TODO
// there's a bit of a design tension here
// without page component scavenging what we end up with here is having to rebuild heavy components
// that's terribly inefficient
// so it may be better to use preact?

let url = "/art/anselm.glb"

		return htmlify`
			<sugar-page>
				<sugar-content>
					<sugar-three-element url=${url}></sugar-three-element>
				</sugar-content>
			</sugar-page>
			`
	}
}
customElements.define('avatar-page', AvatarPage )
