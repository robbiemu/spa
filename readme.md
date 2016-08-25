requireJS-SPA
== 
_a single page app based solely on requireJS_

<img src="http://imgur.com/Z6aUxQU.png" align="center" width="200" />
[firebase example](https://requirejs-spa.firebaseapp.com/)

##Features

This is a basic MVC framework, and was originally a sort of _proof-of-concept_. It supports **routing**, and some degree of **templating** (including 3 tags, `spa-view`, `spa-insert`, and `spa-repeat`, and a fourth `spa-domain` that limits the scope of processing). It provides a callback you can attach to after a page template cycle has completed. You can trigger templating on demand, and it runs once on load.

This started out as a ball of code: my initial SPA was about 150 lines of code plus libs. But then I wanted tags. And then I wanted to remove the dependency on jQuery (awesome as it is).

Thanks to require, each component you write will be anonymously scoped.
Additionally, the style of development is very open to making any sort of page changes you like.

##Basic use

Keeping in mind that the files in the library itself are `spa.js`, `spa_route.js`, and `spa_tags.js`, and **requireJS**'s `require` loads components, while `define` declares them (and injects references from other components as needed) check out the example.

###spa.js

For now this handles the ready state, so that when document loads _spa_ can handle the event, and also one for after the
initial page templating cycle.

### spa_route.js

Handles routing

### spa_tags.js

This handles the templating. The options supported are:

####spa-domain
`<element spa-domain>`
Template cycles use selectors to traverse the DOM. Only those parts of the page within a `[spa-domain]` tag will be considered.

####spa-view
`<element spa-view=name>`
Template files are loaded into the `innerHTML` of `[spa-domain]` tags.

####spa-insert
`<element spa-insert=name>`
A component can expose data for insertion to the `innerHTML` of `[spa-insert]` tags. Where you get that data is up to you (it is meant for variables and data from models, but thanks to the handy use of `define` for _components_, you can easily load more templates here if you wanted).

####spa-repeat
`<element spa-repeat=name>`
A component can expose a function to generate repeating data for insertion to the `innerHTML` of `[spa-repeat]` tags. This was simply a flavor choice.

###Caveats
All of them. This is a sketch of an idea. In particular, there is no pattern used to manage batching events or watching variables. Attaching RxJS to this is probably a next step, since RxAndroid is actually valuable to me, if I am imspired to come back to this. Another option would be to redo it without libraries in ES2016, using include and supporting templating .. and using generators to watch live data.

> Written with [StackEdit](https://stackedit.io/).
