// Detect which list to reference
var lastButtonClicked = null;

function storeLastClicked() {
  lastButtonClicked = $(this);
}

function addLastButtonListener() {
  $('.js-open-list-menu').unbind('click').click(storeLastClicked);
}


// Add Options to Menu
function addLi() {  
  $($('.pop-over-content .pop-over-list')[0]).append("<hr><li><a id='copy-to-clipboard'>Copy To Clipboard</a></li>");
  $('#copy-to-clipboard').unbind('click').click(copyToClipboard);
}

// Option Functionality

function copyToClipboard() {
  myRegEx = /"([^"]*)"/g;
  var listItems = lastButtonClicked.closest('.list').find('.list-cards .list-card').find('.list-card-title').contents().filter(function(){ 
    var filteredList = this.nodeType == 3; 
    for (var i = 0; i < filteredList.length; i++) { 
      console.log(filteredList[i].text());
    };
  })
  
  console.log(listItems[1]);
  //console.log(myRegEx.exec(listItems));
}

$(document).arrive(".js-open-list-menu", addLastButtonListener);
$(document).arrive(".pop-over-content", addLi);

