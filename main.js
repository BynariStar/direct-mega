(function () {
  var output = document.getElementById('output');
  // For future translation
  var messages = [
    "This browser don't support direct downloads. Using fallback method...",
    'Direct MEGA installed, but no file to download.',
    'After the download starts you can now close this window.',
    'Unknown error, loading fallback',
    'Try MEGA directly',
    'Report issue',
    'Click here to finish download if it not starts automatically',
    'Unknown error',
    "Downloading $1 ($2) - don't close this page",
    'Direct MEGA installed, download will start soon.',
    'No file to download.',
  ];
  
  var href = 'https://mega.nz' + (location.hash.length > 2 ? location.hash : ('#' + (location.search || '').substr(1)));

  if (!navigator.serviceWorker) {
    if (href.length <= 16) {
      showMessage(messages[10], true);
      return;
    }
    showMessage(messages[0], true);
    loadFallback();
    return;
  }
  
  navigator.serviceWorker.register('sw.min.js', {scope: '.'})
  .then(navigator.serviceWorker.ready)
  .then(function afterReady(instance){
    showMessage(messages[9], true);
    if (!instance.active || location.search.length > 2) {
      location.reload();
      return;
    }
    
    if (location.hash.length <= 1) {
      showMessage(messages[1], true);
      return;
    }
    
    sendMessage(instance.active, href).then(function (data) {
      location.href = './?' + data.identifier;
      showMessage(messages[2], true);
    });
  }, function (error) {
    console.error(error);
    showMessage(messages[3], true);
    loadFallback();
  });
  
  function loadFallback() {
    var script = document.createElement('script');
    var file;
    var attributes;
    script.src = 'mega.js';
    script.onload = function() {
      file = mega.file(href);
      file.loadAttributes(afterLoadAttributes);
    };
    
    function afterLoadAttributes(err, data) {
      attributes = data;
      if (err) {
        showMessage(messages[7]);
        throw err;
      }
      showMessage(messages[8]
        .replace('$1', attributes.name)
        .replace('$2', humanizeSize(attributes.size)), true);
        
      handleProgress(file.download(afterDownload), attributes.size);
    }
    
    function handleProgress(stream, total) {
      var offset = 0;
      var percentageBar = document.getElementsByClassName('downloading-progress-bar');
      var percentageText = document.getElementsByClassName('percentage');
      document.getElementsByClassName('downloader').className += ' active';
      
      percentageText.textContent = '0%';
      
      stream.on('data', function (data) {
        offset += data.length;
        percentageText.textContent = Math.floor(data * 100 / total) + '%';
        percentageBar.style.width = (data * 100 / total).toFixed(2) + '%';
      });
      
      stream.on('end', function () {
        percentageText.textContent = percentageBar.style.width = '100%';
      });
    }
    
    function afterDownload(err, data) {
      if (err) {
        showMessage(messages[7]);
        throw err;
      }
      var anchor = document.createElement('a');
      anchor.textContent = messages[6];
      
      // data is Uint8Array
      anchor.href = URL.createObjectURL(new Blob([data.buffer], { type: 'application/octet-stream' }));
      anchor.download = attributes.name;
      showMessage('', true);
      output.appendChild(anchor);
      anchor.click();
    }
    
    document.head.appendChild(script)
  }
  
  function humanizeSize(a,b,c,d,e) { // http://stackoverflow.com/a/20463021
    return (b = Math, c = b.log, d = 1024, e = c(a)/c(d)|0, a/b.pow(d,e)).toFixed(2)+' '+(e?'KMGTPEZY'[--e]+'B':'bytes');
  }
  
  function showMessage(message, noError) {
    output.textContent = message;
    output.appendChild(document.createElement('br'));
    
    if (noError) return;
    
    var anchor = document.createElement('a');
    anchor.textContent = messages[4];
    anchor.href = href;
    output.appendChild(anchor);
    output.appendChild(document.createElement('br'));
    
    anchor = document.createElement('a');
    anchor.textContent = messages[5];
    anchor.href = 'https://github.com/qgustavor/direct-mega/issues/new';
    output.appendChild(anchor);
  }
  
  // https://googlechrome.github.io/samples/service-worker/post-message/
  function sendMessage(instance, message) {
    return new Promise(function(resolve, reject) {
      var messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      
      instance.postMessage(message, [messageChannel.port2]);
    });
  }
}());