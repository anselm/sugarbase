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
