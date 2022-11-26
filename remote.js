class DeBSON {
    constructor (socket) {
        this.socket = socket
    }

    cat (categoryName = '') {
        const { socket } = this

        return {
            category: categoryName,
            object: '',
            cmd: '',
            data: '',
            obj (objectName = '') {
                return {
                    category: categoryName,
                    object: objectName,
                    cmd: '',
                    data: '',
                    write (data) {
                        const payload = {
                            category: categoryName,
                            object: objectName,
                            cmd: 'write',
                            data: data
                        }

                        return new Promise((resolve, reject) => {
                            socket.emit('@deb-exec-cmd', payload, (success, data, err) => {
                                if (success) {
                                    resolve(data)
                                } else {
                                    console.error(err)
                                    reject()
                                }
                            })
                        })
                    },
                    read() {
                        const payload = {
                            category: categoryName,
                            object: objectName,
                            cmd: 'read',
                            data: ''
                        }

                        return new Promise((resolve, reject) => {
                            socket.emit('@deb-exec-cmd', payload, (success, data, err) => {
                                if (success) {
                                    resolve(data)
                                } else {
                                    console.error(err)
                                    reject()
                                }
                            })
                        })
                    },
                    delete() {
                        const payload = {
                            category: categoryName,
                            object: objectName,
                            cmd: 'delete',
                            data: ''
                        }

                        return new Promise((resolve, reject) => {
                            socket.emit('@deb-exec-cmd', payload, (success, data, err) => {
                                if (success) {
                                    resolve(data)
                                } else {
                                    console.error(err)
                                    reject()
                                }
                            })
                        })
                    },
                    watch(callbackfunc) {
                        const payload = {
                            category: categoryName,
                            object: objectName,
                            cmd: 'watch',
                            wid: (() => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a => (a ^ Math.random() * 16 >> a / 4).toString(16)) + '-' + Date.now())()
                        }

                        return new Promise((resolve, reject) => {
                            socket.on('@deb-wtrigger-' + payload.wid, (val) => {
                                callbackfunc(val)
                            })

                            socket.emit('@deb-exec-watch-cmd', payload, (success, data, err) => {
                                if (success) {
                                    resolve(data)
                                } else {
                                    console.error(err)
                                    reject()
                                }
                            })
                        })
                    }
                }
            }
        }
    }
}