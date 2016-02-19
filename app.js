var DataCache;

$(document).ready(function() {
  if(!localStorage.DataCache) {
    console.log('No local data found, fetching from API');
    fetchData();
  } else {
    console.log('Local data found, checking if created within a day');
    if(Date.now() - localStorage.DataCacheCreated > 86400000) {
      console.log('Local data is > a day old, fetching from API');
      fetchData();
    } else {
      console.log('Local data exists and was generated less than a day ago, continuing');
      DataCache = JSON.parse(localStorage.DataCache);
      clearLoading();
    }
  }

  $('form').submit(function(event) {
    event.preventDefault();
    var num1 = Number($('#num1').val());
    var num2 = Number($('#num2').val());
    var operator = $('.selected').attr('id');
    processInput(num1, operator, num2);
  });

  $('.error').click(function(event) {
    event.preventDefault();
    $('#num1, #num2').val('');
    $(this).fadeOut('slow');
  });

  $('.op').click(function(event) {
    event.preventDefault();
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
  });
});

function fetchData() {
  $.getJSON('http://pokeapi.co/api/v2/pokemon/', function(data) {
    DataCache = data;
    localStorage.DataCache = JSON.stringify(data);
    localStorage.DataCacheCreated = Date.now();
    clearLoading();
  });
}

function clearLoading() {
  $('.loading').text('Done!').fadeOut('slow');
  $('#num1').focus();
}

function processInput(num1, operator, num2) {
  switch(operator) {
    case 'minus':
      var num = (num1 - num2) - 1; // offset by 1 because array index starts at 0
      break;
    case 'plus':
    default:
      var num = (num1 + num2) - 1; // offset by 1 because array index starts at 0
      break;
  }
  if(num > DataCache.length){
    throwError('too big');
    return;
  }
  if(num < 0) {
    throwError('less than or equal to zero');
    return;
  }
  $('#one').html('#'+num1+'<br>'+DataCache[num1-1].name+'<br><img src="http://pokeapi.co/media/img/'+num1+'.png">');
  $('#operator').text(operator);
  $('#two').html('#'+num2+'<br>'+DataCache[num2-1].name+'<br><img src="http://pokeapi.co/media/img/'+num2+'.png">');
  $('#result').html('#'+(num+1)+'<br>'+DataCache[num].name+'<br><img src="http://pokeapi.co/media/img/'+(num+1)+'.png">');
}

function throwError(err) {
  var error = 'Uh oh! The resulting number was ' + err + '! Click anywhere to try again with different numbers.';
  $('.error > .msg').text(error).parent().css("display", "flex").hide().fadeIn('slow');
}
