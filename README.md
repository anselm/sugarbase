# SugarBase JS Framework

R1 Jan 2021

SugarBase is a javascript minimalist framework for building SPA (single page app) websites. No compilation phase is required and it doesn't try to optimize rewrites to the dom.

## Running

	npm update
	npm start

## Examples

This repository is organized as a series of layers or standalone demos where arranged from very simple capabilities such as pages, cards, forms and routing to more opinionated approaches to style, state, persistence, and mixing 2d and 3d elements together in a page layout.

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

2. JSX and templating systems are the wrong place to express logic. The fact is if you need to deal with procedural logic, and you need to be efficient, then you should use javascript - which exposes the right powers in the right ways. Here is a critique of React:

3. Virtual Dom diffing seems like a bit overkill; others agree:

	https://svelte.dev/blog/virtual-dom-is-pure-overhead

4. Frameworks have their own learning curves, conventions and assumptions. For example React has a philosophy that rendering components are "pure"; that they are purely a reflection of an objects state. This has subtle impacts on how you write logic especially in the render() call. Generally if you stand back and look at frameworks from a 10000 foot view the general pattern is that a framework will define either a new meta-language or a set of conventions, and often that language will be similar but not the same as patterns that typical designers and developers are expected to know. That is to say that often you’ll see some slight variation of HTML, and then some formal way of defining new components that can be expressed in HTML. New patterns, especially when their implementation is hidden, take cognitive load and are hard on people.

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

## Basic Lifecycle

1. New Element Types: New kinds of "components" or elements are declared either with HTMLElement or using an optional thin wrapper on HTMLElement:

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
		return html`<span>{time}</span>`;
	}

	renderOnce() {
		// same as above except only invoked once
	}
}
```

2. Creation: Elements can be instanced from javascript or from html

```javascript
let elem = new MyWidget({color:”blue”});

// attributes are turned into props and can be full blown objects - so this is similar to the above

document.body.innerHTML=“<my-widget color=“blue”></my-widget>”
```

3. Observability: Similar to react and preact you can just set state to force a refresh

```javascript
let widget = new Widget({color:"blue"});
widget.color = "red"
```

Note you cannot trigger an update from sub property change

```javascript
widget.palette.primary = "red"
```

4. General events / observing databases.

Typically real applications are going to watch database state and be responsive to that (web apps tend to be multi participant with real time updates across the network to all participants). Also, almost always, there is a parent component that manages a list of elements; so the pattern isn't so much that an object wants to update itself, but rather it has some logic to specifically find and update children in itself - and the children don't have any particular awareness of database state. There are lots of ways to accomplish this pattern. For example:

```javascript
class DatabaseViewWidget extends SugarElement {
	connectedCallback() {
		// connected can be called more than once... you can also use connectedFirstTime()
		if(!this.observers) {
			// in this example (using a hypothetical database wrapper) a full refresh of state is triggered
			this.observers = Services.observe({table:"activity",kind:"post",offset:0,limit:10,orderby:"created"},(item)=>{
				// - if this is a delete then try find child and delete
				// - if this is an insert or update then search and see if children exist and make
				// - pass item to child as a property to paint if desired
			})
		}
	}
	disconnectedCallback() {
		// sometimes it makes sense to stop observing if not visible; it's up to you
		Services.stop(this.observers)
	}
	doSomething() {
		// sometimes it makes sense to not bother doing work if not attached to dom
		if(!this.isConnected()) return
	}
}
```

5. Designerly: While this tool is programmer leaning, it does have some designer considerations. It should be possible for novice designers to use widgets built by programmers and assemble them fairly easily - if the developers are thoughtful. This is hopefully a reasonable container for a designer to work within:

```javascript
	render() {
		return html`
			<sugar-groups class="sugar-page">
				<sugar-header></sugar-header>
				<sugar-database-cards class="sugar-content" observe="groups">
					<sugar-image-card>example to replace</sugar-image-card>
				</sugar-database-cards>
			</sugar->groups>
			`
	}
```


---

## *elements-site demo*

This shows off some simple elements such as cards and lists and loaders:

	1. cards
	2. lists
	3. *image loader* for adding images and sending them to a server
	4. *preview*
	5. *send to datastore* -> implementation of actually storing in a datastore
	6. *generate different scales* -> i like to generate all of the different preview sizes on client
	7. *picker* for picking from say a bunch of cards and previewing a choice

---

## *routing-site demo*

This showcases a router as a bare bones SPA example. To run this demo checkout the repo and run it like below and then visit the supplied url in a browser:

	npm update
	npm start

Here's a running example:

	https://sugarbase-example.glitch.me/

This router puts some burden on the developer:

1. *Pages*. A SPA website typically shows one page at a time and switches between them. A page is simply an HTMLElement that is registered with the router. The router attaches or detaches the page from the dom if it decides it is visible or not.

2. *Routing*. The developer has to evaluate the user url themselves and decide which page to show. Many frameworks try to provide regex style evaluators for url -> page mappings but these always end up being limited. For example I personally like to have routes based on database queries (so that a path can be a persons moniker - similar to Twitter).

---

## *firebase-site demo*

This demo builds on top of the previous demo adding new capabilities - mainly using firebase to login a user and show observability and update display elements when there are state changes.

To run this tack on ?demo=firebase onto the URL - for example:

	https://localhost:5000?demo=firebase

Of course painting the correct state is a highly desirable quality in web frameworks. Systems such as React use tools like Redux and then use the shadow DOM to effectively maintain a change list for what to repaint. Tools like MobX are a nicer alternative to Redux in some ways as well for this chore. The Svelte framework compiles your source so that it understands exactly where changes may occur. Here I push the labor to somewhat to the developer; providing some observer like abilities but requiring a developer to apply them to the right DOM elements.

You'll need to to some additional setup:

	1. Setup a firebase web app on google firebase (you can google for how to do this)
	2. Use firestore as the database (not the other similarily named-by-marketing one called realtime database)
	3. Turn on firebase hosting also
	4. "firebase login" on the command line
	5. "firebase init" on the command line
	6. "firebase deploy" or "firebase serve" to run the service locally

The demo here should allow you to login and log out and show the correct state at all times.

---

## *styles-site*

The style practice here is to have some global style elements that can be layered to apply to all objects. This is arranged like so:

* *mobile/basic* is a minimalist style foundation with these features:

	1. *large font* -> headers; tends to be somewhat idiomatic and "on brand" showing character of site
	2. *small font* -> content with an emphasis on legibility
	3. *navbar* -> a separate element that I tend to prefer to show on all screens for a consistent look
	4. *page* -> a backdrop for centering; I tend to allow overflow:auto
	5. *subpage* -> a centered column for all content, typically 800px wide; I tend to force room for nav bar
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

TODO
	- perhaps provide example app here of these
	- Cards can be built out in more depth with various kinds of cards in more detail - see https://rebassjs.org/

* *color/springtime* is a set of color choices that styles the above style sets

* *color/warnings* colors for alerts and buttons to indicate safe and dangerous actions

TODO perhaps provide example app here of layering these
TODO add dark mode

* *card-effects* for card related effects

* *effect-general* various general transitions and effects

* *effect-loading* a loading effect

TODO
	- I wouldn't mind exploring fun effects in far more depth;
	- ie; recreate things like https://www.domestika.org/en/courses/1373-psychedelic-animation-with-photoshop-and-after-effect

	- Also may be worth just enumerating practical transitions and effects:
	- also : https://www.youtube.com/watch?v=YHQ820W8FRw

---

## *three-site*

* *3d* for picking from 3d objects and snapshotting them as images

* *3d map* for floating 3d objects on a map

TODO add examples

---

## *cms-site*

Here is a sketch of a typical full blown data driven back end content management website with:

	1. A splash page
	2. Login
	3. Logout
	4. A logged in home page of some kind that enumerates powers
	5. Content page; show a list of content that was created and allow sorting; using card layouts
	6. Content Creation / Edit page; create a new content, including images.
	7. Content detail; examine a content and possibly delete it.
	8. Upload images
	9. Layout collections

TODO build

## NOTES

	* basic-site (done)

	- delete elements site
	- delete style site
	- delete firebase site

	- cms site

	- minor
		- db: synthesize nodes together

		- forms
			- images and thumbs

		- cards non critical features to do
			- test out side by side
			- add sigils

		- collections non critical features to add
			- sort order!
			- paging
			- mark and sweep
			- delete

		- 3d



