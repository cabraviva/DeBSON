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
                            data: data,
                        }

                        return new Promise((resolve, reject) => {
                            socket.emit(payload, (success, data, err) => {
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
                            data: '',
                        }

                        return new Promise((resolve, reject) => {
                            socket.emit(payload, (success, data, err) => {
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
                            data: '',
                        }

                        return new Promise((resolve, reject) => {
                            socket.emit(payload, (success, data, err) => {
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