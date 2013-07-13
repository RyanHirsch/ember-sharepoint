/*! ember-sharepoint - v0.0.0 - 2013-07-13
* Copyright (c) 2013 ; Licensed  */
(function(window) {
  var get = Ember.get;
  window.Ember.SPListAdapter = Ember.Adapter.extend({
    findAll: function(klass, records) {
      var ctx = SP.ClientContext.get_current();
      var web = ctx.get_web();
      ctx.load(web);

      var lists = web.get_lists();
      ctx.load(lists);

      var list = lists.getByTitle(get(klass, 'listTitle')); 
      ctx.load(list);

      var camlQuery = new SP.CamlQuery();
      camlQuery.set_viewXml('');
      var listItems = list.getItems(camlQuery);
      ctx.load(listItems);

      var promise = new Ember.RSVP.Promise(function(resolve, reject){
        ctx.executeQueryAsync(function(sender, args) {
          console.log('success');
          var responseArray = [];
          var enumerator = listItems.getEnumerator();
          while (enumerator.moveNext()) {
            var spObj = enumerator.get_current();
            responseArray.push(spObj.get_fieldValues());
          }
          records.load(klass, responseArray);
          resolve(responseArray);
        }, function(sender, error) {
          console.error(error.get_message());
          reject(error);
        });

      });
      return promise;
    }
  });
})(window);