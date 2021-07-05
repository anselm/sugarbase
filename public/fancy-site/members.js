
export class MembersPage extends SugarElement {
	render() {
		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>Members of area X</h1>
					<a href="/member/edit">Add a member</a>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"member"}}
						card="sugar-card">
					</sugar-collection>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('members-page', MembersPage )

export class MemberDetailPage extends SugarElement {
	render() {
		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>Member Detail Page</h1>
					<a href="/member/edit/1234">Link to edit this member</a>
					<h1>Permissions on Member</h1>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"perm"}}
						card="sugar-card">
					</sugar-collection>
					<br/>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('member-detail-page', MemberDetailPage )


export class MemberEditPage extends SugarElement {
	render() {

		let subject = {
			id:0,
			table:"member",
			title:"Sun sky",
			url:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/1920px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
			image:"my image"
		}

		let schema = {
			id:     {rule:"id",       },
			title:  {rule:"string",   },
			url:    {rule:"string",   },
			image:  {rule:"image",    },
			map:    {rule:"map",      },
			descr:  {rule:"textarea", },
			start:  {rule:"date",     },
			end:    {rule:"date",     },
			submit: {rule:"submit",   },
			remove: {rule:"remove",   },
			cancel: {rule:"cancel",   },
		}

		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>Member Edit</h1>
					<sugar-form subject=${subject} schema=${schema}></sugar-form>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('member-edit-page', MemberEditPage )
