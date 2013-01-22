3DWeaponsServer
===============

Appengine serverside for 3DWeapons app.
Provides a REST interface to the data.
When the HTTP clients request an html response it feeds the data trough mustache template,
in this way the HTML pages are generated.

Their is a clear seperation between database, rest interface, templates.

database -(objectify)-> http rest interface -(json)-> mustache -(html)-> web browser
