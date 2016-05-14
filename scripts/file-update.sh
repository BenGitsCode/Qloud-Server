#!/bin/bash
ID="5737b6b03c794bab6f96bdd2"
TOKEN="2iTLsOGIgxNSTe0sZoBEoToum4caWMqYj/lM67GEXgs=--t+OTzW+NoGvu1O38EkTnaED265raOGVXSDyWXEwPWyE="

curl --include --request PATCH http://localhost:3000/files/$ID \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "file": {
      "title": "How to write Yo Momma Jokes",
      "tags": ["LMAO kind of funny", "jokes", "Best Yo Momma Jokes"]
    }
  }'
