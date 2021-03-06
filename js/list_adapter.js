(function(window) {
  var get = Ember.get;
  var set = Ember.set;

  var ctx = null,
      web = null,
      lists = null;

  window.Ember.SPListAdapter = Ember.Adapter.extend({
    find: function(record, id) {
      var self = this;
      var list = self._getListObject(record.constructor);
      var ctx = list.get_context();

      var listItem = list.getItemById(id);
      ctx.load(listItem);

      var promise = self._runQuery(ctx);

      promise.then(function() {
        var itemValue = listItem.get_fieldValues();
        record.load(id, itemValue);
      });

      return promise;
    },

    findAll: function(klass, records) {
      var self = this;
      var list = self._getListObject(klass);
      var ctx = list.get_context();

      var camlQuery = new SP.CamlQuery();
      camlQuery.set_viewXml('');
      var listItems = list.getItems(camlQuery);
      ctx.load(listItems);

      var promise = self._runQuery(ctx);

      promise.then(function() {
        var responseArray = [];
        var enumerator = listItems.getEnumerator();
        while (enumerator.moveNext()) {
          var spObj = enumerator.get_current();
          responseArray.push(spObj.get_fieldValues());
        }
        window.responseArray = responseArray;
        self._getListMetaData(klass, list);
        records.load(klass, responseArray);
      });
      return promise;
    },

    _getListObject: function(klass) {
      var spListObject = get(klass, 'spListObject');
      if(spListObject) return spListObject;

      var ctx = SP.ClientContext.get_current();
      var web = ctx.get_web();
      var lists = web.get_lists();
      var list = lists.getByTitle(get(klass, 'listTitle'));

      ctx.load(web);
      ctx.load(lists);
      ctx.load(list);

      set(klass, 'spListObject', spListObject);
      return list;
    },

    _runQuery: function(ctx) {
      var promise = new Ember.RSVP.Promise(function(resolve, reject){
        ctx.executeQueryAsync(function(sender, args) {
          resolve();
        },
        function(sender, error) {
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