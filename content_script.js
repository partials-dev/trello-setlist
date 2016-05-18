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
  // List Actions to add
  $list.append(
    "<hr>"
    + "<li><a id='copy-list'>Copy List To Clipboard</a></li>" 
    + "<li><a id='copy-list-and-labels'>Copy List And Labels To Clipboard</a></li>" 
    //+ "<li><a id='share'>Share To... (WIP)</a></li>"
  );
  
  // Listeners
  $('#copy-list').unbind('click').click({includeLabels: false}, copyToClipboard);
  $('#copy-list-and-labels').unbind('click').click({includeLabels: true}, copyToClipboard);
  //$('#share').unbind('click').click(share);
}

// jQuery gets to clean up actual functionality
function $getList () {
  null;
}

function $getCards () {
  null;
}

function $getLabels () {
  null;
}

// Option Functionality

function getListTitle() {
  var listTitle = lastButtonClicked.parents('.list-header').find('.list-header-name-assist').text();
  return '----- ' + listTitle + " -----\n";
}

function getCardTitle(cards, i) {
  var titleObject = $(cards[i]).find('.list-card-title').contents().filter(function () { return this.nodeType === 3; })[0];
  if (!titleObject) {
    return false;
  } else {
    return titleObject.data;
  }
}

function getCardLabels(cards, i, includeLabels) {
  var labels = "";
  if (includeLabels) {
    var labelList = $(cards[i]).find('.list-card-labels');
    for (var n = 0; n < labelList.contents().length; n++) {
      var $currentLabel = $(labelList.contents()[n]);

      var getColorRegEx = /card-label-([a-z]+?)/g;
      var labelColor = getColorRegEx.exec($currentLabel.attr('class'));
  
      if ($.inArray(labelColor[1], ignore) > -1 ) {
        null;
      } else if ($currentLabel.text() === '\xa0') {
        labels += " [" + labelColor[1].toUpperCase() + "]";
      } else if ($currentLabel) {
        labels += " [" + $currentLabel.text() + "]";
      }
    }
  }
  return labels;
}

function getPlainText(includeLabels) {
  var plainText = getListTitle();
  var cards = lastButtonClicked.closest('.list').find('.list-cards .list-card')
  
  for (var i = 0; i < cards.length; i++) { 
    var title = getCardTitle(cards, i);
    if (title === false) {break;}
    var label = getCardLabels(cards, i, includeLabels);

    plainText += title + label + "\n";
  }

  //console.log(plainText); //for debugging
  return plainText;
}

function copyToClipboard (event) {
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = getPlainText(event.data.includeLabels);
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
  var options = { body: theBody, icon: theIcon }
  var n = new Notification(theTitle,options);
}

//Initialization
var ignore = ['g'];
  
Notification.requestPermission().then(function(result) {  // Get permission for notifications
  console.log("TSU Notification permission: " + result);
});

$(document).arrive(".js-open-list-menu", addLastButtonListener);  // Because apparently they take a second to load
$(document).arrive('.pop-over-header', listActionTimeout); // Wait for the popover list to appear, inject extra option(s)
