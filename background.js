var extension = typeof browser !== 'undefined' ? browser : chrome;

// Handle extension installation
extension.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    // Open welcome page on first install
    extension.tabs.create({
      url: extension.runtime.getURL('welcome.html')
    });
  }
});

// Handle extension icon click
extension.action.onClicked.addListener(function(tab) {
  var url = tab.url;
  var title = tab.title;
  if (!url || !title) {
    console.error('Unable to get URL or title');
    return;
  }
  // Sanitize the title to create a valid filename
  var sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 100);
  var filename = sanitizedTitle + '.url';
  // Create the .url file content
  var content = '[InternetShortcut]\r\nURL=' + url;
  // Create a data URL with application/octet-stream MIME type
  var dataUrl = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(content);
  // Use the downloads API to save the file, prompting the user for the location
  extension.downloads.download({
    url: dataUrl,
    filename: filename,
    saveAs: true
  }, function(downloadId) {
    if (extension.runtime.lastError) {
      console.error(extension.runtime.lastError);
    } else {
      console.log('Download started with ID: ' + downloadId);
    }
  });
});