# DeBSON
 DeBSON is the simplest, fastest JSON Database you could think of

# How it works
DeBSON uses Categories which store many Objects. An Object stores one specific Value, either a String, Number, Array or Object. It works like a simple Key-Value Pair. Usally corresponding Objects are stored in the same category. If more objects are stored in a category, the category takes longer to read.

# Usage
```js
const deb = require('debson')
deb.mode('sync') // Optional

// Reading a value
val = deb.cat('MyCategory').obj('MyObject').read()

// Writing a value
deb.cat('MyCategory').obj('MyObject').write({MyValue: 123}) // You can write Strings, Objects, Numbers & Arrays to an Object

// Deleting a value
deb.cat('MyCategory').obj('MyObject').delete()

// Watching a value
deb.cat('MyCategory').obj('MyObject').watch((val) => {
    console.log('Value changed to ' + val)
})
```

# Remote
DeBSON supports a remote connection using socket.io to interact with your database.
**NOTE! This isn't encrypted or secured. Attackers can and will access all of your files and write to them.**

First you have to bind your sockets to your DeBSON client serverside like this:
```js
const io = requrie('socket.io')
const deb = require('debson')

io.on('connection', (socket) => {
    deb.bind(socket)
})
```

Then, add this to your HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/debson@1/remote.min.js"></script>
```

Now you can use following commands in your clients javascript:

```js
const socket = io()
const deb = new DeBSON(socket)

// Reading a value
val = await deb.cat('MyCategory').obj('MyObject').read()

// Writing a value
await deb.cat('MyCategory').obj('MyObject').write({MyValue: 123}) // You can write Strings, Objects, Numbers & Arrays to an Object

// Deleting a value
await deb.cat('MyCategory').obj('MyObject').delete()

// Watching a value
await deb.cat('MyCategory').obj('MyObject').watch((val) => {
    console.log('Value changed to ' + val)
})
```
