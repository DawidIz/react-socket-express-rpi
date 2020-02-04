import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

//const url = [raspberry ip][port]
const url = 'localhost:4000'

const ToggleItem = ({id,value,handleClick}) => 
    <input 
        onChange = {() => handleClick(id)}   
        type = 'checkbox' 
        checked = {value}
    />

const ToggleMenu = props => {
    const [data,setData] = useState([])
    const [socket] = useState(() => io(url))

    useEffect(() => {
        socket.emit('init')
        socket.on('init', res => {
            console.log(res)
            setData(res)
        })

        return () => socket.removeAllListeners()
    },[socket])

    useEffect(() => {
        socket.on('toggle value', res => {
            console.log(res)
            const d = data.map(item => item.id === res.id ? {...item, value : res.value }: item)
            console.log(d)
            setData(d)
        })

        return () => socket.removeAllListeners()
    },[socket,data])

    const handleClick = id => {
        console.log('click')
        socket.emit('toggle value', id)
    }

return <ul>
    <h1>Menu</h1>
    {data.map(item => 
        <li key = {item.id}>
            { item.text }
            <ToggleItem 
                id = { item.id }
                value = { item.value }
                handleClick = { handleClick }
            />
        </li>)}
    </ul>
}

export default ToggleMenu
