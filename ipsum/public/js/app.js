$(document).ready(function() {
//  data.get("localhost", function(data) {
//    console.log(data);
//  });

  
  $('#search').addClass('open');
  $('#search > form > input[type="search"]').focus();

  $('button#delete-output').on('click', function(event) {
     $('#output').html('');
  });
                           
  $('a[href="#search"]').on('click', function(event) {
    event.preventDefault();
    $('#search').addClass('open');
    $('#main-button').hide();
    $('#search > form > input[type="search"]').focus();
  });

  $('#search, button.close').on('click keyup', function(event) {
    if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
        $('#search').addClass('open');
    }
  });
  
  $('#search button.close-search').on('click keyup', function(event) {
    if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
        $('#search').removeClass('open');
    }
  });

  $('form').submit(function(event) {
    event.preventDefault();
    
    var option = $("input:radio[name='option']:checked").val();
    var number= $("#number").val();

    var url = "/ipsum?type=" + option +"&count=" + number;
    
    $('#search').removeClass('open');
    
    data.get(url, function(response) {
      var output = response.split(/\r?\n/);
      $('#output').html('');
      var arrayLength = output.length;
      for (var i = 0; i < arrayLength; i++) {
        $('<p>').html(output[i]).appendTo($('#output'))
      }
    });
    
    return false;
  })
});


