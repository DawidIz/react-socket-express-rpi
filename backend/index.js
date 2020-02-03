const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const DATA = [
    {id : 20, text : 'light', value : 0},
    {id : 21, text : 'outlet', value : 0},
]

io.on('connection', socket => {
    console.log(`new connection socket id: ${socket.id}`)

    socket.on('init',() => {
        socket.emit('init', DATA)
    })

    socket.on('toggle value',(id) => {
        const item = DATA.find(item => item.id === id)
        
        if(item){
            console.log('found')
            item.value = item.value ^ 1
            io.emit('toggle value',{id, value : item.value})
        }
        else console.log('not found')
    })

})

http.listen(4000,() => console.log('Listening'))