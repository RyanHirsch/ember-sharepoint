#Ember-SharePoint

##Introduction:
An attempt to create a custom adapter using [Ember-Model](https://github.com/ebryn/ember-model) for SharePoint 2010

##Features:

- Gets all items from the specified SharePoint List

##Usage:

```javascript
App.Project = Ember.Model.extend({
  Title: Ember.attr(),
  Description: Ember.attr()
});

App.Project.listTitle = 'Projects';
App.Project.adapter = Ember.SPListAdapter.create();

```

##Outstanding:

- Refactor findAll to something that makes sense
- CRUD to List Items (non-versioned lists)
- CRUD to List Items (versioned lists)
- Allow Query
- SPWebAdapter
- SPNavigationAdapter
- Custom view compontents (People Picker, Managed Metadata)