![Team Pizza Beer logo](http://i.imgur.com/s1n7Uf4.png)

# A File Upload API

An API to upload files to. It allows users to add/edit tags to to their files, and organizes the files with a folders-based filesystem.


The API *INSERT NOTES HERE*

## API end-points

| Verb   | URI Pattern            | Controller#Action |
| ----   | -----------            | ----------------- |
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| DELETE | `/sign-out/:id`        | `users#signout`   |
| PATCH  | `/change-password/:id` | `users#changepw`  |
| GET    | `/files`               | `files#index`     |
| POST   | `/files`               | `files#create`    |
| GET    | `/files/:id`           | `files#show`      |
| PATCH  | `/files/:id`           | `files#update`    |
| GET    | `/files/:id/watch`     | `files#watch`     |
| GET    | `/folders`               | `folders#index`     |
| POST   | `/folders`               | `folders#create`    |
| GET    | `/folders/:id`           | `folders#show`      |
| PATCH  | `/folders/:id`           | `folders#update`    |
| GET    | `/folders/:id/watch`     | `folders#watch`     |

All data returned from API actions is formatted as JSON.

---

## User actions

*Summary:*

<table>
<tr>
  <th colspan="3">Request</th>
  <th colspan="2">Response</th>
</tr>
<tr>
  <th>Verb</th>
  <th>URI</th>
  <th>body</th>
  <th>Status</th>
  <th>body</th>
</tr>
<tr>
<td>POST</td>
<td>`/sign-up`</td>
<td><strong>credentials</strong></td>
<td>201, Created</td>
<td><strong>user</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>POST</td>
<td>`/sign-in`</td>
<td><strong>credentials</strong></td>
<td>200 OK</td>
<td><strong>user w/token</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>DELETE</td>
<td>`/sign-out/:id`</td>
<td>empty</td>
<td>201 Created</td>
<td>empty</td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>PATCH</td>
<td>`/change-password/:id`</td>
<td><strong>passwords</strong></td>
<td>204 No Content</td>
<td><strong>user w/token</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><em>empty</em></td>
</tr>
</table>

### signup

The `create` action expects a *POST* of `credentials` identifying a new user to
 create, e.g. using `getFormFields`:

```html
<form>
  <input name="credentials[email]" type="text" value="an@example.email">
  <input name="credentials[password]" type="password" value="an example password">
  <input name="credentials[password_confirmation]" type="password" value="an example password">
</form>

```

or using `JSON`:

```json
{
  "credentials": {
    "email": "an@example.email",
    "password": "an example password",
    "password_confirmation": "an example password"
  }
}
```

The `password_confirmation` field is optional.

If the request is successful, the response will have an HTTP Status of 201,
 Created, and the body will be JSON containing the `id` and `email` of the new
 user, e.g.:

```json
{
  "user": {
    "id": 1,
    "email": "an@example.email"
  }
}
```

If the request is unsuccessful, the response will have an HTTP Status of 400 Bad
 Request, and the response body will be empty.

### signin

The `signin` action expects a *POST* with `credentials` identifying a previously
 registered user, e.g.:

```html
<form>
  <input name="credentials[email]" type="text" value="an@example.email">
  <input name="credentials[password]" type="password" value="an example password">
</form>
```

or:

```json
{
  "credentials": {
    "email": "an@example.email",
    "password": "an example password"
  }
}
```

If the request is successful, the response will have an HTTP Status of 200 OK,
 and the body will be JSON containing the user's `id`, `email`, and the `token`
 used to authenticate other requests, e.g.:

```json
{
  "user": {
    "id": 1,
    "email": "an@example.email",
    "token": "an example authentication token"
  }
}
```

If the request is unsuccessful, the response will have an HTTP Status of 401
 Unauthorized, and the response body will be empty.

### signout

The `signout` actions is a *DELETE* specifying the `id` of the user so sign out.

If the request is successful the response will have an HTTP status of 204 No
 Content.

If the request is unsuccessful, the response will have a status of 401
 Unauthorized.

### changepw

The `changepw` action expects a PATCH of `passwords` specifying the `old` and
 `new`.

If the request is successful the response will have an HTTP status of 204 No
 Content.

If the request is unsuccessful the reponse will have an HTTP status of 400 Bad
 Request.

---

The `sign-out` and `change-password` requests must include a valid HTTP header
 `Authorization: Token token=<token>` or they will be rejected with a status of
 401 Unauthorized.

## Application Actions

All file action requests must include a valid HTTP header `Authorization: Token
 token=<token>` or they will be rejected with a status of 401 Unauthorized.

All of the file actions, except for `watch`, follow the *RESTful* style.

Games are associated with users, `player_x` and `player_o`.
Actions, other than update, will only retrieve a file if the user associated
 with the `Authorization` header is one of those two users.
If this requirement is unmet, the response will be 404 Not Found, except for
 the index action which will return an empty games array.

*Summary:*

<table>
<tr>
  <th colspan="3">Request</th>
  <th colspan="2">Response</th>
</tr>
<tr>
  <th>Verb</th>
  <th>URI</th>
  <th>body</th>
  <th>Status</th>
  <th>body</th>
</tr>
<tr>
<td>GET</td>
<td>`/games[?over=<true|false>]`</td>
<td>n/a</td>
<td>200, OK</td>
<td><strong>games found</strong></td>
</tr>
<tr>
  <td colspan="3">
  The optional `over` query parameter restricts the response to games with a
   matching `over` property.
  </td>
  <td>200, OK</td>
  <td><em>empty games</em></td>
</tr>
<tr>
  <td colspan="3">
  The default is to retrieve all games associated with the user..
  </td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>POST</td>
<td>`/games`</td>
<td>n/a</td>
<td>201, Created</td>
<td><strong>game created</strong></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
<td>GET</td>
<td>`/games/:id`</td>
<td>n/a</td>
<td>200, OK</td>
<td><strong>game found</strong</td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>404 Not Found</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>PATCH</td>
<td>`/games/:id`</td>
<td><em>empty</em></td>
<td>200, OK</td>
<td><strong>game joined</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>PATCH</td>
<td>`/games/:id`</td>
<td><strong>game delta</strong></td>
<td>200, OK</td>
<td><strong>game updated</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>404 Not Found</td>
  <td><em>empty</em></td>
</tr>
</table>

### index

The `index` action is a *GET* that retrieves all the games associated with a
 user.
The response body will contain JSON containing an array of games, e.g.:

```json
{
  "games": [
    {
      "id": 1,
      "cells": ["o","x","o","x","o","x","o","x","o"],
      "over": true,
      "player_x": {
        "id": 1,
        "email": "and@and.com"
      },
      "player_o": {
        "id": 3,
        "email": "dna@dna.com"
      }
    },
    {
      "id": 2,
      "cells": ["","","","","","","","",""],
      "over": false,
      "player_x": {
        "id": 3,
        "email": "dna@dna.com"
      },
      "player_o": {
        "id": 1,
        "email": "and@and.com"
      }
    }
  ]
}
```

If the `over` query parameter is specified the results will be restricted
 accordingly.

If there are no games associated with the user, the response body will contain
 an empty games array, e.g.:

```json
{
  "games": [
  ]
}
```

### create

The `create` action expects a *POST* with an empty body (e.g `''` or `'{}'` if
 JSON).
If the request is successful, the response will have an HTTP Status of 201
 Created, and the body will contain JSON of the created game with `player_x` set
to the user calling `create`, e.g.:

```json
{
  "game": {
    "id": 3,
    "cells": ["","","","","","","","",""],
    "over": false,
    "player_x": {
      "id": 1,
      "email": "and@and.com"
    },
    "player_o": null
  }
}
```

If the request is unsuccessful, the response will have an HTTP Status of 400 Bad
 Request, and the response body will be JSON describing the errors.

### show

The `show` action is a *GET* specifing the `id` of the game to retrieve.
If the request is successful the status will be 200, OK, and the response body
 will contain JSON for the game requested, e.g.:

```json
{
  "game": {
    "id": 1,
    "cells": ["o","x","o","x","o","x","o","x","o"],
    "over": true,
    "player_x": {
      "id": 1,
      "email": "and@and.com"
    },
    "player_o": {
      "id": 3,
      "email": "dna@dna.com"
    }
  }
}
```

### update

#### join a game as player 'o'

This `update` action expects an empty (e.g `''` or `'{}'` if JSON) *PATCH* to
 join an existing game.

If the request is successful, the response will have an HTTP Status of 200 OK,
 and the body will be JSON containing the game joined, e.g.:

```json
{
  "game": {
    "id": 1,
    "cells": ["","","","","","","","",""],
    "over":false,
    "player_x": {
      "id": 1,
      "email": "and@and.com"
      },
    "player_o": {
      "id": 3,
      "email":
      "dna@dna.com"
    }
  }
}
```

If the request is unsuccessful, the response will have an HTTP Status of 400 Bad
 Request, and the response body will be empty (game cannot be joined, player_o
 already set or user making request is player_x) or JSON describing the errors.

#### update a game's states

This `update` action expects a *PATCH* with changes to to an existing game,
 e.g.:

```html
<form>
  <input name="game[cell][index]" type="text" value="0">
  <input name="game[cell][value]" type="text" value="x">
  <input name="game[over]" type="text" value="false">
</form>
```

```json
{
  "game": {
    "cell": {
      "index": 0,
      "value": "x"
    },
    "over": false
  }
}
```

If the request is successful, the response will have an HTTP Status of 200 OK,
 and the body will be JSON containing the modified game, e.g.:

```json
{
  "game": {
    "id": 1,
    "cells": ["x","","","","","","","",""],
    "over":false,
    "player_x": {
      "id": 1,
      "email": "and@and.com"
      },
    "player_o": {
      "id": 3,
      "email":
      "dna@dna.com"
    }
  }
}
```

If the request is unsuccessful, the response will have an HTTP Status of 400 Bad
 Request, and the response body will be JSON describing the errors.

### watch

The `watch` action is handled differently than all the others.  Because `watch`
 implements a streaming source of data, we'll use a wrapper around the html5
 object EventSource to handle the events sent.

You can find the wrapper [here](public/js/resource-watcher-0.1.0.js).
The wrapper is also available from the deployed app at the path
 `/js/resource-watcher-0.1.0.js`.

The events that watch implements let you know when a game has been updated.
By using this interface you can write code that lets a player see another's move
 almost as it happens.
Updates to the game from one player's browser are sent to the other's browser.

You create a watcher object using the resourceWatcher function.
This function takes two parameters, the watch url and a configuration object
 which must contain the Authorization token, and may contain an optional timeout
 in seconds, e.g.:

```js
let gameWatcher = resourceWatcher('<server>/games/:id/watch', {
      Authorization: 'Token token=<token>'[,
      timeout: <timeout>]
});
```

The watched resource has a default timeout of 120 seconds.

You should add a handler for `change` and `error` events.
The error events are not the most informative.
The change event may return a timeout or a heartbeat.

```js
gameWatcher.on('change', function (data) {
  if (data.timeout) { //not an error
    gameWatcher.close();
    return console.warn(data.timeout);
  } else if (data.game && data.game.cell) {
    let game = data.game;
    let cell = game.cell;
    $('#watch-index').val(cell.index);
    $('#watch-value').val(cell.value);
  } else {
    console.log(data);
  }

});

gameWatcher.on('error', function (e) {
  console.error('an error has occurred with the stream', e);
});
```

## [License](LICENSE)

Source code distributed under the MIT license. Text and other assets copyright
General Assembly, Inc., all rights reserved.
