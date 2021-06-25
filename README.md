# SugarBase JS Framework

R1 Jan 2021

A JS framework for SPA apps with these features:

1. Not reactive.
2. Does not need to be compiled; is pure js.
3. "Pages" are pure HTMLElements where you have to write all your layout yourself.
4. Router routes between registered pages, showing only one page at a time.
5. Router intercepts all hyperlink clicks and switches to the relevant page.
6. Router uses "/" paths rather than "#" paths.
7. Router decorates page with "hidden" css class rather than relying on element.visible which doesn't always work

These are the major pieces:

## Page Concept

Sugar only shows one "page" at a time and hides the rest.

Sugar does not have any reactive features built in - pages and page contents don't get "triggered" or "refreshed" or "updated" in the background by any state change.

HTMLElements in pure javascript are used to represent a page. This is largely built in to modern browsers and although there is a bit of extra extension support with componentWillShow() this is otherwise largely vanilla. 

## Fragment Concept

Fragments are also HTMLElements... there is nothing magical about them. Use at will.

## Routing

Routing is the cornerstone of the app. To start the router make an instance of it and call reset. This forces it to attempt to produce the current URL. To go to a page you build a hyper link to it... all links are intercepted.

## Firebase and Reactivity

Reactivity is a highly desirable quality for building websites. Page contents can change often and it can be a hassle to repaint a page. Traditional systems such as React use the shadow DOM and look for deltas or differences between what is presented and what is not presented. However I feel like I can explicitly manage differences if they are well scoped so I use a weaker solution which is included in business_logic that sits in-between two extremes of repainting everything versus keeping a difference list. MobX is also a good choice and there are firebase observability bindings as well.

## CSS

I don't concern myself with CSS at all in the core architecture. There are no special CSS features here. It's up to the user to do whatever they want. My own practice is to have a few different CSS files, one for absolute bare bones global elements, and then a few for differences that are increasingly specialized. This way I can layer CSS together to produce a final effect.












