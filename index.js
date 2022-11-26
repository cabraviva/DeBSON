const fs = require('fs')
const path = require('path')
let sync = true
let folder = path.join(process.cwd(), '.DeBSON')
if (!fs.existsSync(folder)) fs.mkdirSync(folder)
const handlers = []

class DeBSONObject {
    constructor (pth, obj) {
        this.pth = pth
        this.obj = obj
    }

    _readCat () {
        if (sync) {
            return JSON.parse(`${fs.readFileSync(this.pth)}`)
        } else {
            let p = this
            return new Promise((resolve) => {
                fs.readFile(p.pth, (err, data) => {
                    if (err) throw err
                    return resolve(JSON.parse(`${data}`))
                })
            })
        }
    }

    /**
     * It returns a promise that resolves to the value of the object property `this.obj` of the object
     * returned by the promise returned by the function `this._readCat()`.
     * 
     * The function `this._readCat()` returns a promise that resolves to an object. The function
     * `this.read()` returns a promise that resolves to the value of the object property `this.obj` of
     * the object returned by the promise returned by the function `this._readCat()`.
     * 
     * The function `this.read()` returns a promise that resolves to the value of the object property
     * `this.obj` of the object returned by the promise returned by the function `this._readCat()`.
     * 
     * The function `this.read()` returns a promise that resolves to the value of the object property
     * `this.obj` of the object returned by the promise returned by the function `this._readCat()`.
     * @returns The value of the property of the object.
     */
    read () {
        if (sync) {
            return this._readCat()[this.obj]
        } else {
            p = this
            return new Promise(resolve => {
                // deepcode ignore PromiseNotCaughtNode: <please specify a reason of ignoring this>
                p._readCat().then(r => {
                    return resolve(r[p.obj])
                })
            })
        }
    }

    /**
     * It reads a file, modifies the content, and writes it back to the file.
     * @param content - The content to write to the file.
     * @returns A promise.
     */
    write (content) {
        if (sync) {
            let c = this._readCat()
            if (c[this.obj] !== content) {
                for (const handler of handlers) {
                    handler(content)
                }
            }
            c[this.obj] = content
            fs.writeFileSync(this.pth, JSON.stringify(c))
        } else {
            let p = this
            return new Promise((resolve) => {
                // deepcode ignore PromiseNotCaughtNode: <please specify a reason of ignoring this>
                p._readCat().then(r => {
                    if (r[p.obj] !== content) {
                        for (const handler of handlers) {
                            handler(content)
                        }
                    }
                    r[p.obj] = content
                    fs.writeFile(this.pth, JSON.stringify(r), 'utf8', () =>  {
                        resolve()
                    })
                })
            })
        }
    }

    watch (cb) {
        handlers.push(cb)
    }

    /**
     * It deletes the value of the variable.
     */
    delete () {
        this.write(undefined)
    }

    /**
     * It deletes the value of the variable.
     */
    del() {
        this.write(undefined)
    }
}

const DeBSON = {
    env: {},
    /**
     * It takes a string as an argument and sets the value of the sync variable to true if the string
     * is 'sync' and false if the string is 'async'.
     * @param mode - This is the mode you want to set the function to. It can be either 'sync' or
     * 'async'.
     */
    mode (mode) {
        if (!mode) throw new Error('No mode specified')
        if (mode === 'sync') {
            sync = true
        } else if (mode === 'async') {
            sync = false
        } else {
            throw new Error('Please specify a valid mode')
        }
    },

    folder (folder) {
        if (!folder) throw new Error('No folder specified')
        if (!fs.existsSync(folder)) fs.mkdirSync(folder)
    },

    /* Creating or choosing a category. */
    category (categoryName) {
        if (typeof categoryName !== 'string' || categoryName === '') throw new Error('Please specify a valid category name')
        const filepath = path.join(folder, categoryName + '.deb.json')


        if (sync) {
            if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, '{}')

            DeBSON.env = {pth: filepath, inCat: true}
            return DeBSON
        } else {
            return new Promise((resolve) => {
                fs.exists(filepath, (exists => {
                    if (!exists) {
                        fs.writeFile(filepath, '{}', (err) => {
                            if (err) throw err
                            DeBSON.env = {pth: filepath, inCat: true}
                            return resolve(DeBSON)
                        })
                    }
                }))
            })
        }
    },

    /**
     * It returns a new DeBSONObject, which is a class that has methods to get and set values in the
     * database
     * @param objName - The name of the object you want to create.
     * @returns A new DeBSONObject.
     */
    obj (objName) {
        if (!DeBSON.env.inCat) throw Error('Please choose a category first')
        objName = `${objName}`
        if (objName === '') objName = 'EMPTY_OBJ_NAME!76537'
        return new DeBSONObject(DeBSON.env.pth, objName)
    },

    /**
     * Binds a socket (from socket.io) for remote connection
     */
    bind (socket) {
        let p = this

        socket.on('@deb-test-connection', (cb) => {
            cb()
        })

        socket.on('@deb-exec-cmd', (payload, cb) => {
            let success = true
            let data = null
            let err = null

            try {
                const category = p.category(payload.category)
                const object = category.obj(payload.object)

                if (payload.cmd === 'write') {
                    object.write(payload.data)
                } else if (payload.cmd === 'read') {
                    data = object.read()
                } else if (payload.cmd === 'delete') {
                    object.delete()
                } else if (payload.cmd === 'watch') {
                    console.log(payload)
                    object.watch(payload.callback)
                } else {
                    throw new Error('Invalid Command')
                }
            } catch (e) {
                success = false
                console.error(e)
                err = e
            }

            cb(success, data, err)
        })
    }
}

DeBSON.cat = DeBSON.category
DeBSON.object = DeBSON.obj

module.exports = DeBSON