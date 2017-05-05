(function() {
  'use strict';

  var scanBtn = document.getElementById('scan-btn'),
      scanOutput = document.getElementById('scan-output'),

      ipInput = document.getElementById('tested-ip'),
      urlInput = document.getElementById('tested-url'),
      testedBtn = document.getElementById('tested-btn'),
      testedOutput = document.getElementById('tested-output'),

      addName = document.getElementById('add-name'),
      addIp = document.getElementById('add-ip'),
      addDataRegexp = document.getElementById('add-data-regexp'),
      addDataUrl = document.getElementById('add-data-url'),
      addFirstSwName = document.getElementById('add-first-sw-name'),
      addFirstSwUrl = document.getElementById('add-first-sw-url'),
      addSecondSwName = document.getElementById('add-second-sw-name'),
      addSecondSwUrl = document.getElementById('add-second-sw-url'),
      addBtn = document.getElementById('add-btn');

  function httpGet(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', url, true);

      xhr.onload = function() {
        if (this.status === 200) {
          resolve(this);
        } else {
          var error = new Error(this.reponseText);

          error.code = this.status;
          reject(error);
        }
      };

      xhr.onerror = function() {
        reject(new Error('Network Error'));
      };

      xhr.send();
    });
  }

  scanBtn.addEventListener('click', function(event) {
    httpGet('/scan')
      .then(function(response) {
        scanOutput.innerHTML = response.response;
      })
      .catch(function(error) {
        console.log('Error: ', error);
      });
  });

  testedBtn.addEventListener('click', function(event) {
    var ip = ipInput.value.trim(),
        url = urlInput.value.trim();

    if (!ip || !url) {
      return;
    }

    httpGet('/test/' + ip + url)
      .then(function(response) {
        testedOutput.innerHTML = response.response;
      })
      .catch(function(error) {
        console.log('Error: ', error);
      });
  });

  addBtn.addEventListener('click', function(event) {
    var name = addName.value.trim(),
        ip = addIp.value.trim(),
        regExp = addDataRegexp.value.trim(),
        url = addDataUrl.value.trim(),
        firstSwName = addFirstSwName.value.trim(),
        firstSwUrl = addFirstSwUrl.value.trim(),
        secondSwName = addSecondSwName.value.trim(),
        secondSwUrl = addSecondSwUrl.value.trim(),

        xhr = new XMLHttpRequest(),
        data;

    if (!name || !regExp || !url) {
      return;
    }

    data = {
      ip: ip,
      name: name,
      data: url,
      regExp: regExp,
      switcherOne: {
        name: firstSwName,
        url: firstSwUrl
      },
      switcherTwo: {
        name: secondSwName,
        url: secondSwUrl
      }
    };
    console.log(data);

    xhr.open('POST', '/add', true);

    // xhr.onload = function() {

    // }


    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send( JSON.stringify(data) );
  });

}());