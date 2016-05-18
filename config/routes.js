'use strict';

module.exports = require('lib/wiring/routes')
// get all files and folders that belong to user
.get('/nodes', 'nodes#index')
// get files and folders that are in a directory
.get('/nodes/:id', 'nodes#show')
// delete a file or folder
.delete('/nodes/:id', 'nodes#destroy')
// update a file or folder
.patch('/nodes/:id', 'nodes#update')
// create a file
.post('/create-file', 'nodes#createFile')
// create a folder
.post('/create-folder', 'nodes#createFolder')
// users of the app have special requirements
.post('/sign-up', 'users#signup')
.post('/sign-in', 'users#signin')
.delete('/sign-out/:id', 'users#signout')
.patch('/change-password/:id', 'users#changepw')
.resources('users', { only: ['index', 'show'] })
// all routes created
;
