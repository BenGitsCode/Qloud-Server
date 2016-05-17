'use strict';

module.exports = require('lib/wiring/routes')

// create routes

// what to run for `GET /`
.root('root#root')

// standards RESTful routes
.resources('examples')
.resources('files')
.resources('folders')

.delete('/nodes/:id', 'nodes#destroy')
.patch('/nodes/:id', 'nodes#update')
.get('/nodes', 'nodes#index')
.get('/nodes/:id', 'nodes#show')
.post('/nodes/create-file', 'nodes#createFile')
.post('/create-folder', 'nodes#createFolder')
// custom routes for file system navigation
.post('/nodes/test', 'nodes#show')
.post('/folders/test', 'folders#show')
.post('/files/test', 'files#show')
// users of the app have special requirements
.post('/sign-up', 'users#signup')
.post('/sign-in', 'users#signin')
.delete('/sign-out/:id', 'users#signout')
.patch('/change-password/:id', 'users#changepw')
.resources('users', { only: ['index', 'show'] })

// all routes created
;
