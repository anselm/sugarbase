# Practices

## Basic Lifecycle Of Layout Elements / Components

1. Defining New Element Types:

New kinds of "components" or elements are defined either with HTMLElement or using an optional thin wrapper on HTMLElement. Below is an example. Note that htmlify is a "tagged template function" jsx converter I use to let me pass rich props around (the custom element built in setattribute function cannot handle objects only strings):

```javascript
class MyWidget extends SugarElement {

	// enumeration of local variables; anything statically defined here will trigger redraw events on change
	static defaults = { time: Date.now() }

	// this is invoked by the dom when an element is connected to display
	connectedCallback() {}

	// only invoked once
	connectedFirstTime() {}

	// invoked on disconnect; such as a page being hidden
	disconnectedCallback() {}

	// a state change observer on props
	propChanged() {}

	render() {
		// the same as preact and react you can use the html tagged template function to describe a layout
		let time = new Date(this.state.time).toLocaleTimeString();
		return htmlify`<span>{time}</span>`;
	}

	renderOnce() {
		// same as above except only invoked once
	}
}
```

2. Instancing:

Elements can be instanced from javascript or from html or from mixtures of both:

```javascript
let elem = new MyWidget({color:”blue”});

let mycolor = "blue"
document.body.innerHTML=`<my-widget color=${mycolor}></my-widget>`
```

Arguments can be passed to an explicit constructor, or as html "attributes" (which I treat as merely props in a constructor), or can be set in defaults. The router (described later) can also pass arguments to new objects being created.

3. Observability: Similar to react and preact you can just set state to force a refresh:

```javascript
let widget = new Widget({color:"blue"});
widget.color = "red"
```

Note no updates are triggered from sub-property change however:

```javascript
widget.palette.primary = "red"
```

5. Rendering on state change:

Similar to React you supply a render() method which returns a template to render. This is called when an element is built and whenever any observed property in the element changes. You can also call repaint() to force render.

```javascript
	render() {
		let query = db.query({table:"events",uid:db.currentParty.id,offset:0,limit:100})
		return htmlify`
			<page>
				<collection query=${query}>
					<image-card>example card to show copies of</image-card>
				</collection>
			</sugar->groups>
			`
	}
```

React encourages you to just repaint all your children. Instead I prefer to explicitly render children in collections myself. Typicaly I will listen to some database state (such as on a remote server) and then hand-manage the rendering of children:

```javascript
class DatabaseViewWidget extends SugarElement {
	connectedCallback() {
		// connected can be called more than once.
		if(this.observers) return
		// in this example a database observer starts feeding this code state changes:
		this.observer = Services.db.observe(this.observer,{table:"activity",kind:"post",offset:0,limit:10,orderby:"created"},(dbthing)=>{
			switch(dbthing.transaction) {
				let elem = this.querySelector(`[id=${dbthing.id}]`)
				case "remove":
					elem.remove()
					break
				case "insert":
				case "update":
					if(!elem) { elem = new MyWidget(); this.append(elem); elem.id = dbthing.id }
					elem.observedproperty = dbthing
			}
		})
	}
	disconnectedCallback() {
		// will set this.observer to zero after making sure it is flushed down at database level
		this.observer = Services.db.observe(this.observer)
	}
}
```

6. Routing and Pages

A SPA website typically shows one page at a time and switches between them. A page is simply an HTMLElement that is registered with the router. The client side router attaches or detaches the page from the dom if it decides it is visible or not - and it manipulates the url in the browser itself so that the user feels like they are actually in a traditional web experience (I intercept all requests to go to a new url).

I prefer to push evaluating routes out to the developer rather than providing regex style pattern matching. For example I personally like to have routes based on database queries (so that a path can be a persons moniker - similar to Twitter).

Also you can force new pages up with window.history.pushState({},"/path","/path") or by letting users click ordinary hyperlinks with ordinary paths (all paths are intercepted and evaluated, and if local then I stop them from doing their normal page load and instead run the router).

Here's an example routing setup:

```javascript

export let user_stuff_router = (segments) => {
	if(!segments || segments.length < 1 || segments[0].length==0) {
		return "splash-page"
	}
	switch(segments[0]) {
		case "profile": return {element:"party-profile-page", myargument:123 }
		case "login": return "party-login-page"
		case "signout": return "party-signout-page"
		case "events": return "events-page"
		default: break
	}
	return "sugar-404-page"
}

router.push(user_stuff_router)

```

7. Services

There are many small and large kinds of pieces that are helpful for building web-sites such as basic state observability, bindings to real databases and so on. I've included a few snippets and organized them under a "Services" folder.

View synchronization and state observability in general is a perennial issue that deeply pervades the design of modern web frameworks. A view should change to reflect some state; for example if a user logs out, or if a remote participant deletes an object another user is looking at. People often reach for tools like Redux or MobX here. Other frameworks like Svelte try to magick away these concerns by compiling your logic and having deeper introspection on what state is being painted where. I prefer in general to push view synchronization to the developer; providing some observer like abilities but requiring a developer to apply them to the right DOM elements themselves.

Another issue is binding to real databases like firestore. I provide an example of this as well.

There are several other smaller services and pieces; content sanitization, generating random names - any number of kinds of small chores that are nice to haves.

8. Style

TBD

The style practice here (which you are free to ignore) is to have some global style elements that can be layered to apply to all objects. This is arranged like so:

* *mobile/basic* is a minimalist style foundation with these features:

	1. *large font* -> headers; tends to be somewhat idiomatic and "on brand" showing character of site
	2. *small font* -> content with an emphasis on legibility
	3. *navbar* -> a separate element that I tend to prefer to show on all screens for a consistent look
	4. *page* -> a backdrop for centering; I tend to allow overflow:auto
	5. *content* -> a centered column for all content, typically 800px wide; I tend to force room for nav bar
	6. *color* -> is not set at this level; default colors are used

* *bigform* bold large style inputs and buttons for capturing user input

	1. *buttons*
	2. *input* -> for inputting text
	3. *radio* -> radio and other buttons are not provided

* *cards* for card centric layout styles - with these features:

	1. *sizes* -> from tiny to large
	2. *role* -> visual hints to indicate if interactive or passive or if a primary call out or a response
	3. *tiling* -> various ways of arranging cards
	4. *observable* -> efficiently updating displayed card lists based on state change on server
