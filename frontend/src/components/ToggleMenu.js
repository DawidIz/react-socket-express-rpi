import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import styled from 'styled-components'

const url = 'http://192.168.1.210:4000'

const List = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 1rem;

    & > li {
        background-color: #771177;
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        margin: 1px 0;
    }

    & > li > input[type = "checkbox"] {
        background-color: white;
        appearance: none;
        width: 2rem;
        height: 1rem;
        transition: .5s;
        border-radius: 1rem;
        position: relative;
        outline: none;
    }

    & > li > input[type = "checkbox"]:checked {
        background-color: lightblue;
    }

    & > li > input[type = "checkbox"]::after{
        content: '';
        position: absolute;
        width: 1rem;
        height: 1rem;
        background-color: white;
        border-radius: 1rem;
        transform: scale(1.2)
    }

    & > li > input[type = "checkbox"]:checked::after{
        right: 0;
    }

`

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

return <List>
    xd
    {data.map(item => 
        <li key = {item.id}>
            { item.text }
            <ToggleItem 
                id = { item.id }
                value = { item.value }
                handleClick = { handleClick }
            />
        </li>)}
    </List>
}

export default ToggleMenu