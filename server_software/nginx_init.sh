#!/bin/bash
sudo ln -sf ~/web/backend/esp8266_conference/nginx.conf /etc/nginx/sites-enabled/default
sudo /etc/init.d/nginx stop
sudo /etc/init.d/nginx start