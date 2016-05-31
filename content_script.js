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
  return lastButtonClicked.parents('.list');
}

function $getArrayOfCards () {
  list = $getList();
  return list.find('.list-cards .list-card');
}

function $getCurrentCard (i) {
  return $($getArrayOfCards()[i]);
}

function $getLabels () {
  null;
}

// Option Functionality

function getListTitle() {
  var listTitle = $getList().find('.list-header-name-assist').text();
  return '----- ' + listTitle + " ----- \n";
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
  var getColorRegEx = /card-label-([a-z]+?)/;
  
  var labelList = $(cards[i]).find('.list-card-labels');
  var labels = "";
  
  for (var n = 0; n < labelList.contents().length; n++) {
    var $currentLabel = $(labelList.contents()[n]);
    var labelText = $currentLabel.text();

    var labelColor = getColorRegEx.exec($currentLabel.attr('class'))[1];

    if ($.inArray(labelColor, ignore) > -1 ) { // Check if it's in ignored labels
      null;
    } else if (labelText === '\xa0') { // Use the color if no labeltext (contains a space by default)
      labels += " [" + labelColor.toUpperCase() + "]";
    } else if ($currentLabel) { // Use label text
      labels += " [" + labelText + "]";
    }
  }
  return labels;
}

function getPlainText(includeLabels) {
  var plainText = getListTitle();

  var cards = $getArrayOfCards();
  for (var i = 0; i < cards.length; i++) { 
    var title = getCardTitle(cards, i);
    
    if (title === false) {break;}
    
    if (includeLabels) { title += getCardLabels(cards, i); }
    plainText += title + "\n";
  }

  console.log(plainText); // for debugging
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
var ignore = []; // ['g', 'r'] etc...
  
Notification.requestPermission().then(function(result) {  // Get permission for notifications
  console.log("TSU Notification permission: " + result);
});

$(document).arrive(".js-open-list-menu", addLastButtonListener);  // Because apparently they take a second to load
$(document).arrive('.pop-over-header', listActionTimeout); // Wait for the popover list to appear, inject extra option(s)
