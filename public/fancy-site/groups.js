
export class GroupsPage extends SugarElement {
	render() {
		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>List of Groups</h1>
					<a href="/group/create">[Create a group now]</a>
					<br/>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"group"}}
						card="sugar-card-medium">
					</sugar-collection>
				</sugar-content>
			</sugar-page>

<sticky-note contenteditable="true">
<h2>What are groups?</h2>
<br/>
Groups are the main way to organize people around a common interest, such as employees in a team.
</sticky-note>

			`
	}
}
customElements.define('groups-page', GroupsPage )

export class GroupDetailPage extends SugarElement {
	static defaults = {
		subject:0 // if subject changes then force update
	}
	render() {
		if(!this.subject || !this.subject.id) return
		let id = this.subject.id

		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>Group: ${this.subject.title}</h1>
					<sugar-card artifact=${this.subject}></sugar-card>
					<a href="/group/${id}/edit">[Edit this group]</a>
					<br/>
					<a href="/group/${id}/activity/create">[Create a new activity in this group]</a>
					<br/>
					<a href="/group/${id}/members">[Browse members]</a>
					<br/>
					<h3>Upcoming activities:</h3>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"activity",parentid:id,age:"new"}}
						card="sugar-card">
					</sugar-collection>
					<h3>Previous activities:</h3>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"activity",parentid:id,age:"old"}}
						card="sugar-card">
					</sugar-collection>
					<br/>
				</sugar-content>
			</sugar-page>


<sticky-note contenteditable="true">
<h2>A Group Detail</h2>
<br/>
Groups are the core organizing concept of this system.
An admin can create a group and invite their team to it.
This page shows fresh activity related to the group.
It also allows some users to edit the group.
</sticky-note>
			`
	}
}
customElements.define('group-detail-page', GroupDetailPage )

///
/// Caller is expected to inject a subject
///

export class GroupEditPage extends SugarElement {
	static defaults = {
		subject:0 // if subject changes then force update
	}
	render() {

		let subject = this.subject
		if(!subject) subject = {table:"group"}

		let schema = {
			id:     {rule:"id",       },
			title:  {rule:"string",   label:"Title"  },
			descr:  {rule:"textarea", label:"Description" },
			image:  {rule:"image",    label:"Image"},
			submit: {rule:"submit",   label:"Submit" },
			remove: {rule:"remove",   label:"Delete" },
			cancel: {rule:"cancel",   label:"Cancel" },
		}

		let submit = async (subject) => {
			let result = await Services.db.post(subject)
			if(result && result.id) {
				window.history.pushState({},result.volatile.url,result.volatile.url)
			} else {
				alert("Could not post!")
			}
		}

		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>${subject.id?"Edit":"Create"} Group</h1>
					<sugar-form subject=${subject} schema=${schema} submit=${submit}></sugar-form>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('group-edit-page', GroupEditPage )
