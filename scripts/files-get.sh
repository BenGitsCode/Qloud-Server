#!/bin/bash
TOKEN="2iTLsOGIgxNSTe0sZoBEoToum4caWMqYj/lM67GEXgs=--t+OTzW+NoGvu1O38EkTnaED265raOGVXSDyWXEwPWyE="

curl --include --request GET http://localhost:3000/files \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
