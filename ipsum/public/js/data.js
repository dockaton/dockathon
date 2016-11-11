var data = (function() {
  return {
    get: function(url, callback) {
      $.ajax({
        type: "GET",
        url: url,
        success: function(data){
           callback(data);
        }
      });
    },
    post: function(url, data, callback) {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        success: function(data){
           callback(data);
        }
      });
    }
  }
})();