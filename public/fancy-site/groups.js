
export class GroupsPage extends SugarElement {
	render() {
		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>List of Groups</h1>
					<a href="/group/edit">[Create a group now]</a>
					<br/>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"group"}}
						card="sugar-card">
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
		subject:{}
	}
	render() {
		if(!this.subject || !this.subject.id) return
		let id = this.subject.id
		console.log("**** looking at a group in detail")
		console.log(this.subject)

		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>Group: ${this.subject.title}</h1>
					<sugar-card artifact=${this.subject}></sugar-card>
					<a href="/event/edit">[Create an event in this group]</a>
					<br/>
					<a href="/group/edit/${id}">[Edit this group]</a>
					<br/>
					<a href="/group/members/${id}">[Browse members]</a>
					<br/>
					<h3>Upcoming events in this group:</h3>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"event",parent:id}}
						card="sugar-card">
					</sugar-collection>
					<h3>Older events in this group:</h3>
					<br/>
				</sugar-content>
			</sugar-page>


<sticky-note contenteditable="true">
<h2>A Group Detail</h2>
<br/>
This page show important activity related to a group, such as upcoming events.
It also shows legacy activity, such as past events.
Also provides a way to browse the members of this group.
</sticky-note>


			`
	}
}
customElements.define('group-detail-page', GroupDetailPage )


export class GroupEditPage extends SugarElement {
	static defaults = {
		virgin:{
			id:0,
			table:"group",
			title:"",
			url:"",
		},
		subject:{}
	}
	render() {

		let subject = this.subject

// get rid of defaults

console.log("**** being asked to render group edit page ...")
console.log(subject)

		let schema = {
			id:     {rule:"id",       },
			title:  {rule:"string",  label:"Title"  },
			descr:  {rule:"textarea", label:"Description" },
//			url:    {rule:"string",  label:"Image"  },
			image:  {rule:"image",    label:"Image"},
			map:    {rule:"map",      },
			start:  {rule:"date",     },
			end:    {rule:"date",     },
			submit: {rule:"submit",   label:"Submit" },
			remove: {rule:"remove",   label:"Delete" },
			cancel: {rule:"cancel",   label:"Cancel" },
		}

		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>${subject.id?"Edit":"Create"} Group</h1>
					<sugar-form subject=${subject} schema=${schema}></sugar-form>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('group-edit-page', GroupEditPage )
