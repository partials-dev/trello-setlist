// Detect which list to reference
var lastButtonClicked = null;

function storeLastClicked() {
  lastButtonClicked = $(this);
}

function addLastButtonListener() {
  $('.js-open-list-menu').unbind('click').click(storeLastClicked);
}

// Add Options to Menu

function listActionTimeout() {
  var self = this;
  setTimeout(function () {
    if ($(self).find('.pop-over-header-title').contents()[0].data === "List Actions") {
      addLi($(self).siblings().first().find('.pop-over-content .pop-over-list').first());
    }
  }, 50)
}

function addLi($list) {  
  // List Actions
  $list.append(
    "<hr>"
    + "<li><a id='copy-to-clipboard'>Copy To Clipboard</a></li>" 
    //+ "<li><a id='share'>Share To... (WIP)</a></li>"
  );
  
  // Listeners
  $('#copy-to-clipboard').unbind('click').click(copyToClipboard);
  //$('#share').unbind('click').click(share);
}

// Option Functionality

function getPlainText() {
  var cards = lastButtonClicked.closest('.list').find('.list-cards .list-card')
  var plainText = "";
  for (var i = 0; i < cards.length; i++) { // Iterate over cards, get title
    var titleObject = $(cards[i]).find('.list-card-title').contents().filter(function () { return this.nodeType === 3; })[0];
    if (!titleObject) {break;} // So we don't accidentally try to find the title of the card composer.
    var title = titleObject.data;
    
    // Iterate through labels, build label tag
    var labelList = $(cards[i]).find('.list-card-labels');
    var label = "";

    for (var n = 0; n < labelList.contents().length; n++) {

      var $currentLabel = $(labelList.contents()[n]);

      if ($currentLabel.text() === '\xa0') {
        var getColorRegEx = /card-label-([a-z]+?)/g;
        var regExColor = getColorRegEx.exec($currentLabel.attr('class'));
        label += " [" + regExColor[1].toUpperCase() + "]";
      } else if ($currentLabel) {
        label += " [" + $currentLabel.text() + "]";
      }
    }

    plainText += title + label + "\n";
  }
  console.log(plainText); //for debugging
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
  console.log('Copied to Clipboard');
  spawnNotification('List copied to clipboard!', './icon.png', 'Trello Setlist Utility');
} 

function share() {
  console.log('Share Button Clicked');
  spawnNotification('Sorry, not implemented yet.', './icon.png', 'Trello Setlist Utility');
}

// Notifications

function spawnNotification(theBody, theIcon, theTitle) {
  var options = {
        body: theBody,
        icon: theIcon
    }
  var n = new Notification(theTitle,options);
}

//Initialization

Notification.requestPermission().then(function(result) {  // Get permission for notifications
  console.log("TSU Notification permission: " + result);
});

$(document).arrive(".js-open-list-menu", addLastButtonListener);  // Because apparently they take a second to load
$(document).arrive('.pop-over-header', listActionTimeout); // Wait for the popover list to appear, inject extra option(s)
