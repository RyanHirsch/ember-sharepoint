#Ember-SharePoint
An attempt to create a custom adapter using [Ember-Model](https://github.com/ebryn/ember-model) for SharePoint 2010


###Usage:

```javascript
App.Project = Ember.Model.extend({
  Title: Ember.attr(),
  Description: Ember.attr()
});

App.Project.listTitle = 'Projects';
App.Project.adapter = Ember.SPListAdapter.create();

```