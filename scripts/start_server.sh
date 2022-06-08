#!/bin/bash
# sudo chmod 755 /var/www/server.js # optional
# this will restart app/server on instance reboot
#crontab -l | { cat; echo "@reboot pm2 start npm --name "ViPay-Backend" -- start"; } | crontab -
#give permissions 777
sudo chmod -R 777 /var/www/html/ViPay-Backend
#install dependecies
cd /var/www/html/ViPay-Backend/ && npm install
#Check server running or not accordingly start or reload server
pm2 describe ViPay-Backend > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  pm2 start npm --name "ViPay-Backend" -- start
else
  pm2 reload ViPay-Backend
fi;

#save pm2
pm2 save
