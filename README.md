# DeBSON
 DeBSON is the simplest, fastest JSON Database you could think of

# How it works
DeBSON uses Categories which store many Objects. An Object stores one specific Value, either a String, Numer, Array or Object. It works like a simple Key-Value Pair. Usally corresponding Objects are stored in the same category. If more objects are stored in a category, the category takes longer to read.

# Usage
```js
const deb = require('debson')
deb.mode('sync') // Optional

// Reading a value
val = deb.cat('MyCategory').obj('MyObject').read()

// Reading a value
val = deb.cat('MyCategory').obj('MyObject').write({MyValue: 123}) // You can write Strings, Objects, Numbers & Arrays to an Object

// Deleting a value
val = deb.cat('MyCategory').obj('MyObject').delete()
```