// Detect which list to reference
var lastButtonClicked = null;

function storeLastClicked() {
  lastButtonClicked = $(this);
}

function addLastButtonListener() {
  $('.js-open-list-menu').unbind('click').click(storeLastClicked);
}

// Add Options to Menu

function addLi($list) {  
  $list.append(
    "<hr>"
    + "<li><a id='copy-to-clipboard'>Copy To Clipboard</a></li>" 
    + "<li><a id='share'>Share To... (WIP)</a></li>"
  );

  $('#copy-to-clipboard').unbind('click').click(copyToClipboard);
  $('#share').unbind('click').click(share);
}

// Option Functionality

function getPlainText() {
  var cards = lastButtonClicked.closest('.list').find('.list-cards .list-card')
  var plainText = "";
  for (var i = 0; i < cards.length; i++) {
    var titleObject = $(cards[i]).find('.list-card-title').contents().filter(function () { return this.nodeType === 3; })[0];
    if (!titleObject) {break;}

    var title = titleObject.data

    if ($(cards[i]).find('.card-label').text() === '\xa0') {

      // Implementation 1: slice
      //var color = $(cards[i]).find('.card-label').attr('class').split('-')[3].slice(0,1);
      //var label = " [" + color.toUpperCase() +"]";

      // Implementation 2: regex capture group
      var getColorRegEx = /card-label-([a-z]+?)/g;
      var regExColor = getColorRegEx.exec($(cards[i]).find('.card-label').attr('class'));
      var label = "RegEx: [" + regExColor[1].toUpperCase() + "]";

      // Implementation 3: color cache
      //var labelColors = ['green', 'yellow', 'orange', 'purple', 'sky', 'lime', 'pink', 'black', 'null'];
      //var labelClass = $(cards[i]).find('.card-label').attr('class');
      //var label = labelColors.filter(function (color) {
        //var matchColor = new RegExp(color);
        //return matchColor.test(labelClass);
      //}).reduce(function (label, color) {
        //label += " [" + color[0] + "]"
        //return label;
      //}, "");

    } else if ($(cards[i]).find('.card-label')[0]) {
      var label = " [" + $(cards[i]).find('.card-label').text() + "]";
    } else {
      var label = "";
    }

    plainText += title + label + "\n";
  }
  console.log(plainText);
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

Notification.requestPermission().then(function(result) {
  console.log("TSU Notification permission: " + result);
});

$(document).arrive(".js-open-list-menu", addLastButtonListener);
$(document).arrive('.pop-over-header', function () {
  var self = this;

  setTimeout(function () {
    if ($(self).find('.pop-over-header-title').contents()[0].data === "List Actions") {
      addLi($(self).siblings().first().find('.pop-over-content .pop-over-list').first());
    }
  }, 50)
});
