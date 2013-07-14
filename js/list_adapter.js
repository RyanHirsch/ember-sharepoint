(function(window) {
  var get = Ember.get;
  var set = Ember.set;

  var ctx = null,
      web = null,
      lists = null;

  window.Ember.SPListAdapter = Ember.Adapter.extend({
    find: function(record, id) {
      var self = this;
      //  SharePoint stuff really need to figure out a cleaner way
      var ctx = SP.ClientContext.get_current();
      var web = ctx.get_web();
      ctx.load(web);

      var lists = web.get_lists();
      ctx.load(lists);

      var list = lists.getByTitle(get(record.constructor, 'listTitle')); 
      window.list = list;
      ctx.load(list);
      //  Done with SharePoint stuff...

      var listItem = list.getItemById(id);
      ctx.load(listItem);

      var promise = new Ember.RSVP.Promise(function(resolve, reject){
        ctx.executeQueryAsync(function(sender, args) {
          var itemValue = listItem.get_fieldValues();

          //  Is there a point to do both the load and the resolve?
          // self._getListMetaData(klass, itemValue);

          record.load(id, itemValue);
          resolve(itemValue);
        }, function(sender, error) {
          console.error(error.get_message());
          reject(error);
        });

      });
      return promise;
    },

    findAll: function(klass, records) {
      var self = this;
      //  SharePoint stuff really need to figure out a cleaner way
      var ctx = SP.ClientContext.get_current();
      var web = ctx.get_web();
      ctx.load(web);

      var lists = web.get_lists();
      ctx.load(lists);

      var list = lists.getByTitle(get(klass, 'listTitle')); 
      window.list = list;
      ctx.load(list);
      //  Done with SharePoint stuff...

      var camlQuery = new SP.CamlQuery();
      camlQuery.set_viewXml('');
      var listItems = list.getItems(camlQuery);
      ctx.load(listItems);

      var promise = new Ember.RSVP.Promise(function(resolve, reject){
        ctx.executeQueryAsync(function(sender, args) {
          var responseArray = [];
          var enumerator = listItems.getEnumerator();
          while (enumerator.moveNext()) {
            var spObj = enumerator.get_current();
            responseArray.push(spObj.get_fieldValues());
          }

          //  Is there a point to do both the load and the resolve?
          self._getListMetaData(klass, list);

          records.load(klass, responseArray);
          resolve(responseArray);
        }, function(sender, error) {
          console.error(error.get_message());
          reject(error);
        });

      });
      return promise;
    },

    _getListMetaData: function(klass, spListObject) {
      set(klass, 'listVersioning', spListObject.get_enableVersioning());
      set(klass, 'listDescription', spListObject.get_enableVersioning());
    }
  });
})(window);


// get_description();
// get_defaultDisplayFormUrl();
// get_defaultEditFormUrl();
// get_defaultNewFormUrl();
// get_defaultViewFormUrl();
// get_enableVersioning();
// get_onQuickLaunch();
// get_id();
// get_views();