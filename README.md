# SugarBase JS Framework
R1 July 2021

# Overview

SugarBase is a yet another javascript minimalist framework for building SPA (single page app) web experiences riffing on the React/Preact model of a JSX dom parser and components. No compilation phase is required and it doesn't try to optimize rewrites to the dom. There's a strong emphasis on useful components, back end firebase integration and 3d widgets.

## Examples

I've built a couple of examples to show off elements (such as routing, pages, forms, lists, 3d widgets):

You can see this running if you visit:

	https://sugarbase-example.glitch.me/

Also there is a /basic-site.html that you can examine if you want to see a simpler example (view source helps also):

	https://sugarbase-example.glitch.me/basic-site.html

Or you can fetch it run it yourself:

	open a shell window or bring up git somehow
	git checkout https://github.com/anselm/sugarbase
	cd sugarbase
	npm update
	npm start
	visit https://localhost:3456/

There is a firebase demo as well that you can run separately. You'll need to to some additional setup:

	1. Setup a firebase web app on google firebase (you can google for how to do this)
	2. Use firestore as the database (not the other similarily named-by-marketing one called realtime database)
	3. Turn on firebase hosting also
	4. "firebase login" on the command line
	5. "firebase init" on the command line
	6. "firebase deploy" or "firebase serve" to run the service locally

The firebase demo should allow you to login and log out and show the correct state at all times persistently.

## Larger Theory of App Development

This project is focused on a narrow sliver of the larger picture of building user experiences - what I think is the sweet spot of the intersection of many different stakeholders: the user experience and some of the state management of that user experience. Today (luckily) enterprise cloud services have largely crushed back end issues; authentication, perms, hosting, real time queries, scaling, replication and so on. So in this project I'm focusing mostly on pieces higher up the stack.

The larger "components stack" (outside the scope of this framework) can be phrased as a question - which is "What are the pieces required to fully build and deploy a modern multi-participant data-driven real world app?". That stack may be something like this (and you may have your own opinions about such a stack as well):

1. Back end server administration, replication, scaleability, analytics, backups, edge compute.

2. Database design, efficient queries, security, broadcasting and mirroring state to clients in real time.

3. UX design, accessiblity, user stories, aethetics, branding and market phrasing. This can involve many interviews of users, a lot of time in Figma and other design tools, and a lot of thinking; paper prototypes, mood boards and so on.

4. *UX Development* is where this framework focuses; on visible user components. Work here can be a form of applied philosophy or a praxis of half code half playtesting. Sometimes it takes place on a living app. Basically it is a somewhat exploratory labor where teams are doing research on building an airplane while flying it. What's important is to make playing around here as easy as possible.

5. Executive issues; creating transparency among all stakeholders, managing production, exploring product market fit.

6. Deployment of revisions, validating that there is a performant customer experience, A/B testing, collecting analytics on customer engagement and improving, and maintaining the experience often a multiplicity of kinds of devices in the wild.

## UX Development in general

In the narrow sliver of focus around what I am loosely calling "UX Development" are as well many sub-pieces. Just on the development side if you want to deliver experiences for groups of people you must have at least these core ducks in a row:

1. Model. The raw underlying state of a web experience or app is inevitably big pile of user accounts, events, upvotes, photographs, groups, locations, songs, videos, permissions and so on. Because most apps have multiple users there's a lot of subtle property state associated with each artifact; careful thinking around permissions, access control lists, authentication and so on has to be a part of your data model.

2. Control. There is intermediate logic that mediates interaction with the raw state. Often that intermediate logic is on a server side for security but it is not necessarily the case that there is a single monolithic server side app. Often there are many hundreds or even thousands of separate bits of software script, written in a handful of different languages, walking over the database, pruning, updating, querying, inserting, grooming on cron jobs or on demand. Database state is often incrementally managed; objects are marked as dirty and then later on a separate sweep operation performs an update and so on. Work is very granular and distributed, and often not even in one language or tool. API's are exposed to the net, some database operations themselves trigger attached rules to begin other operations, some events like authentication require a 2fa sms text message first before permitting a commit and so on.

3. View. For the consumer an app itself is presenting some digest of that back end state. Modern apps are effectively massively multiplayer online games; they replicate state to all participants in real time - well designed apps show changes dynamically. As well a well designed app present information in a way that is not overwhelming, often understands user permissions in relationship to data objects so that it can steer the user in the right direction; presenting useful views (and avoiding letting them try do things that the server will disallow).

## Focus of this Framework in specific

This framework provides client-side view related pieces specifically for web based apps. It presumes there is some server side to talk to and that that server side exposes some kind of API with locked down authentication and perms.

A framework choice here is that I don't want to coerce programmers and designers to do things in only one way. Rather I provide many small pieces that I *do* join together in ways that I like, but that you can re-arrange in different ways if you have different feelings about how pieces should fit together.

That said the examples do express some opinion on model, view, control issues; background code architecture, clarity, separation of concerns, foreground components, best practices for setting and rendering state, top level concerns such as where to put css, how to flexibly style components, recommended best practices around style itself, and separating style into layers.

There's a strong emphasis on providing actual useful components, not just being an abstract framework, and a strong emphasis on being deliberately underpowered, magic-free and transparent at a source code level so that if things do go wrong (and they will) you can step trace to them and see what is up clearly without having to deep dive or learn new concepts.

## Comparisons to React, Svelte and others

Modern web apps can be hard to write both from a design perspective and from a engineering perspective.

Often designers works in HTML, which is a right-sized grammar for their work, arranging visual building blocks to satisfy the user experience requirements. This can include simple things like the color of a button, but can also include complex things such as accessibility, what information each page displays, transitions between pages, what to do if there is an error and so on.

But these underlying building blocks are not magically created. Behind the scenes a programmer often defines pieces for the designer; in a sense the programmer and designer work together - the programmer typically listens carefully to designer needs, and then builds pieces to empower the designer to do the rest of the work.

Frameworks can help both designers and coders. React, for example, exposes HTML in a fairly conventional way that is comfortable to designers, while also providing a consistent way for programmers to create new building blocks. Today there are thousands of libraries of useful visual widgets and components based on React, and React has been very successful as a pattern.

Frameworks also take care of some subtle chores that are not entirely obvious. The lifecycle of a component, and actually painting content to the screen in a complex app by hand can take several steps:

1. Declaring new components. Most frameworks extend the browser built-in concept of a 'Custom Element'. Unfortunately this is a poorly designed concept and frameworks largely exist to try patch around this. See : https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements . Some of the design flaws include not being able to pass complex types as attributes, not being able to set attributes in a constructor, not being able to add children in a constructor, having to declare custom elements 'define' prior to use, requiring dashes in element names and so on. It's almost like WhatWG and W3C go out of their way to produce baroque and limited anti-design that hurts the web rather than help sadly. Frameworks exist to work around these design bugs.

2. Passing state. Because Custom Element attributes cannot handle complex objects developers must implement their own state mechanism. In Preact and React you'll see a props or a defaults or a properties field that is used to indicate which state is important to a component.

3. Dealing with layout. Because (again) Custom Element handles attributes poorly, you'll often see a JSX style pre-pass on html templates in order to be able to pass rich state. See html template tag functions.

4. Virtual DOM. Another pattern often seen with React like frameworks is a virtual dom diffing; where there is a (mistaken) impression that painting to the DOM is slow, and they carefully virtually diff changes and only render what is needed. (I prefer to make the developer do this work themselves, and themselves decide when they need to repaint - and I prefer not to support virtual diffing at all).

Abstractions such as React help but also have flaws:

1. Leaky abstractions. Despite how nice React can be in terms of providing a high level abstraction and understanding of a complex system it does have serious implementation defects. No abstraction is perfect, and it means that designers have to now often know React and HTML and Javascript.

2. JSX and templating systems are the wrong place to express logic. The fact is if you need to deal with procedural logic, and you need to be efficient, then you should use javascript - which exposes the right powers in the right ways.

3. Virtual Dom diffing seems like a bit overkill; others agree:

	https://svelte.dev/blog/virtual-dom-is-pure-overhead

4. Frameworks have their own learning curves, conventions and assumptions. This can be very frustrating for novices; assumptions are implicit and it's not clear *why* a specific approach is taken. For example React has a philosophy that rendering components are "pure"; that they are purely a reflection of an objects state. This has subtle impacts on how you write logic especially in the render() call.

Generally if you stand back and look at frameworks from a 10000 foot view the general pattern is that a framework will define either a new meta-language or a set of conventions, and often that language will be similar but not the same as patterns that typical designers and developers are expected to know. That is to say that often you’ll see some slight variation of HTML, and then some formal way of defining new components that can be expressed in HTML. New patterns, especially when their implementation is hidden, take cognitive load and are hard on people.

Here are a few links to a few deep dives on other frameworks and framework related issues if you are interested:

	https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
	https://css-tricks.com/creating-a-custom-element-from-scratch/
	https://lit-element.polymer-project.org/guide
	https://dev.to/jfbrennan/custom-html-tags-4788
	https://mobx.js.org/README.html
	https://unpkg.com/browse/htm@2.2.1/README.md
	https://preactjs.com/
	https://svelte.dev/
	https://lit.dev/

# Best Practices

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

3. Observability: Similar to react and preact you can just set state to force a refresh:

```javascript
let widget = new Widget({color:"blue"});
widget.color = "red"
```

Note no updates are triggered from sub-property change however:

```javascript
widget.palette.primary = "red"
```

4. Event driven instantiation:

I prefer to be fairly explicit about managing children layout elements in database driven lists. Typically real applications are going to watch database state and be responsive to that (web apps tend to be multi participant with real time updates across the network to all participants). Also, almost always, there is a parent component that manages a list of elements; so the pattern isn't so much that an object wants to update itself, but rather it has some logic to specifically find and update children in itself - and the children don't have any particular awareness of database state. There are lots of ways to accomplish this pattern. For example:

```javascript
class DatabaseViewWidget extends SugarElement {
	connectedCallback() {
		// connected can be called more than once... you can also use connectedFirstTime()
		if(!this.observers) {
			// in this example (using a hypothetical database wrapper) a full refresh of state is triggered
			this.observers = Services.db.observe({table:"activity",kind:"post",offset:0,limit:10,orderby:"created"},(dbthing)=>{
				switch(dbthing.transaction) {
					let elem = this.querySelector(`[id=${dbthing.id}]`)
					case "remove":
						elem.remove()
						break
					case "insert":
					case "update":
						if(!elem) { elem = new MyWidget(); this.append(elem); elem.id = dbthing.id }
						elem.dbthing = dbthing
				}
			})
		}
	}
	disconnectedCallback() {
		// sometimes it makes sense to stop observing if not visible; it's up to you
		Services.stop(this.observers)
	}
}
```

5. Instancing in a layout:

Some elements are moderately static - where programmers may set a few details, but designers set the rest. It should be possible for novice designers to use widgets built by programmers and assemble them fairly easily - if the developers are thoughtful. Designers and programmers can even agree on ideas like "provide one example of what this list should show". This is hopefully a reasonable container for a designer to work within.

```javascript
	render() {
		let query = db.query({table:"events",uid:db.currentParty.id,offset:0,limit:100})
		return html`
			<page>
				<collection query=${query}>
					<image-card>example card to show copies of</image-card>
				</collection>
			</sugar->groups>
			`
	}
```

6. Routing and Pages

A SPA website typically shows one page at a time and switches between them. A page is simply an HTMLElement that is registered with the router. The client side router attaches or detaches the page from the dom if it decides it is visible or not - and it manipulates the url in the browser itself so that the user feels like they are actually in a traditional web experience.

I prefer to push routing out to the developer rather than providing regex style pattern matching. For example I personally like to have routes based on database queries (so that a path can be a persons moniker - similar to Twitter).

Here's an example:

```javascript

export let user_router = (segments) => {
	if(!segments || segments.length < 1 || segments[0].length==0) {
		return "splash-page"
	}
	switch(segments[0]) {
		case "profile": return "party-profile-page"
		case "login": return "party-login-page"
		case "signout": return "party-signout-page"
		case "events": return "events-page"
		default: break
	}
	return "sugar-404-page"
}

document.addEventListener('DOMContentLoaded', ()=>{
	htmlify2dom(document.body,htmlify`<sugar-router user_router=${user_router}></sugar-router>`)
})

```

7. Services and State

There are many small and large kinds of pieces that are helpful for building web-sites such as basic state observability, bindings to real databases and so on. I've included a few snippets and organized them under a "Services" concept. These speak to these points:

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

# Database Design


TBD


# TODO

- style issues?

	- consider simplifying and reducing the base css styles to be more minimal
	- rebassjs.org has some nice style ideas that could be used in cards
	- have a dark style
	- explore fun effects and layouts a bit - purely as a design exploration
		- ie; recreate things like https://www.domestika.org/en/courses/1373-psychedelic-animation-with-photoshop-and-after-effect
		- Also may be worth just enumerating practical transitions and effects:
		- also : https://www.youtube.com/watch?v=YHQ820W8FRw

	? delete style-site -> fold into base

- basic elements polish
	- image uploaders with thumb generators

	- forms
		- images and thumbs

	- cards non critical features to do
		- test out side by side
		- add sigils

	- collections non critical features to add
		- sort order on client regardless of arrival order!
		- search
		- paging
		- mark and sweep
		- delete

	- router
		- it would be nice to make several copies of pages when they are persistent; and only flush the super oldest ones
		- this would reduce rebuild time?

- 3d components
	- individual objects
	- 3d map
	- 3d multiplayer space

- refining the fancy demo; firebase issues

	- test real firebase -> does it mirror the ramdb api?
	- test real logging in

	- joined query support?
		- synthesize nodes together; provide consistent wrapper to firebase, use rxfire?
		- often we want to fill out some extra information when we get say an event, or a room or a post; such as the sponsor profile
		- these can be separate queries on the back end and it is arguable if we should join them on the back or the front
		- i am not sure what sugar does or if firebase can do this itself

	- get profile (a third party may want to get not just a uid but a filled out object on a profile associated with an auth id)
		- i probably needed an extended profile concept

	- database schema permissions


generic crud

	- generic list widget
		[button: search/filter][paging][sort] -> may want to sort by stuff you made versus stuff you are associated with
		[button: create] -> if permitted to make groups/events or so on
		{ list } -> show list of cards of this item... in a short form with various layouts, maybe with an age+activity indicator

		- card view
			[button: edit/del] -> button to these if user has perms (and if we wish to show this here - sometimes may not want that)
			{ image, descr, sponsor-sigil }
			{ age indicator }
			{ activity indicator }

	- detail
		[button: edit/delete ] -> link to these if user has perms
		{ image, descr, sponsor-sigil }

		{ detail activity }?

	- detail activity???

		- this can be just a list widget of a thing
		- for a group this would list recent posts
		- or for an event it could just be recent joins / leaves

		{ a feed of recent activity } -> in a group this can list posts, 
		{ individual posts? }	-> in some senses of the term group, a group manages some content; such as people, posts, activity
		{ participants }		-> in other senses a group just manages participants

	- detail edit
		form editor -> round trip
		private / public / perms


	- detail edit related -> an event or group needs something like this?

		{ add }
		{ participants }(+/-) 		-> it seems like this is the only thing that we need to control here - for groups only


	- 


