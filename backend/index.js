const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const gpio = require('onoff').Gpio

const DATA = [
    {id : 20, text : 'Light', value : 0 , gpio : new gpio(20,'out')},
    {id : 21, text : 'Socket', value : 0, gpio : new gpio(21,'out')},
]

io.on('connection', socket => {
    console.log(`connection id: ${socket.id} ip: ${socket.handshake.address}`)

    socket.on('init',() => {
        socket.emit('init', DATA)
    })

    socket.on('toggle value',(id) => {
        const item = DATA.find(item => item.id === id)
        
        if(item){
            const pin = item.gpio

            pin.read((err,value) => {
                if(err) throw err

                item.value = value ^ 1

                pin.write(item.value, err => {
                    if(err) throw err

                    io.emit('toggle value',{id, value : item.value})
                })
            })
        }
        else console.log('not found')
    })

    socket.on('disconnect',() => console.log(`disconnected id: ${socket.id}`))
})

http.listen(4000,() => console.log('Listening'))
