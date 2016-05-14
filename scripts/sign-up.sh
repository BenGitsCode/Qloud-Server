#!/bin/bash

curl --include --request POST http://localhost:3000/sign-up \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "cat@aol.com",
      "password": "123",
      "password_confirmation": "123"
    }
  }'

curl --include --request POST http://localhost:3000/sign-up \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "dog@aol.com",
      "password": "123",
      "password_confirmation": "123"
    }
  }'
