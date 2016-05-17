// Detect which list to reference
var lastButtonClicked = null;

function storeLastClicked() {
  lastButtonClicked = $(this);
}

function addLastButtonListener() {
  $('.js-open-list-menu').unbind('click').click(storeLastClicked);
}


// Add Options to Menu
function addLi($header) {  
  $header.append(
    "<hr><li><a id='copy-to-clipboard'>Copy To Clipboard</a></li> <li><a id='share'>Share To... (WIP)</a></li>"
  );

  $('#copy-to-clipboard').unbind('click').click(copyToClipboard);
  $('#share').unbind('click').click(share);
}

// Notifications

Notification.requestPermission().then(function(result) {
  console.log(result);
});

function spawnNotification(theBody, theIcon, theTitle) {
  var options = {
        body: theBody,
        icon: theIcon
    }
  var n = new Notification(theTitle,options);
}


// Option Functionality

function getPlainText() {
  var listItems = lastButtonClicked.closest('.list').find('.list-cards .list-card').find('.list-card-title').contents();
  var filteredList = listItems.filter(function () { return this.nodeType === 3; });
  
  var plainText = "";
  for (var i = 0; i < filteredList.length; i++) {
    plainText += filteredList[i].data + "\n"
  }
  return plainText;
}

function copyToClipboard () {
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = getPlainText();
  document.body.appendChild(copyFrom);
  copyFrom.focus();
  document.execCommand('SelectAll');
  document.execCommand('Copy');
  document.body.removeChild(copyFrom);
  spawnNotification('List copied to clipboard!', null, 'Trello Setlist Utility');
} 

function share() {
  console.log('Share Button Clicked');
}

$(document).arrive(".js-open-list-menu", addLastButtonListener);
$(document).arrive('.pop-over-header', function () {
  var self = this;

  setTimeout(function () {
    if ($(self).find('.pop-over-header-title').contents()[0].data === "List Actions") {
      addLi($(self).siblings().first().find('.pop-over-content .pop-over-list').first());
    }
  }, 50)
});

