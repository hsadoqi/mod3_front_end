document.addEventListener("DOMContentLoaded", () => {
const CHANNELS_URL = 'http://localhost:3000/channels'
const MESSAGES_URL = 'http://localhost:3000/messages'
const USERS_URL = 'http://localhost:3000/users'
const channelList = document.getElementById('channel-list')
const body = document.querySelector('body')

function init(){
    document.addEventListener("click", doThings)

    fetch(CHANNELS_URL)
    .then(res => res.json())
    .then(json => {
        json.forEach(channel => {
            displayChannel(channel)
        })
    })
}

function displayChannel(channel){
    // console.log(channel.id)
    channelList.innerHTML += `<li data-id="${channel.id}" id="${channel.name}">${channel.name}
    <button id="join-channel" data-id="${channel.id}">Click to Join Channel!</button>
    <button id="delete-channel" data-id="${channel.id}">Delete channel</button></li>`
}

function doThings(e){
    e.preventDefault()
    if(e.target.id === "join-channel"){
        setChannel(e)
    } else if(e.target.id === "delete-channel") {
        deleteChannel(e)
    } else if(e.target.id === "new-channel"){
        createChannel(e)
    }
}

function setChannel(e){
    let id = e.target.parentElement.dataset.id
    body.innerHTML = `<h1 data-id="${id}">${e.target.parentElement.id}</h1>`
    // How do I get the messages for this particular channel?
    // Do we just fetch messages from the channel URL?
    // Check the JSON we get back

    // console.log(e.target)
    fetch(`${CHANNELS_URL}/${id}`)
    .then(res => res.json())
    .then(json => {
        json.messages.forEach(showMessage)
    })
}

function showMessage(message){
    // let username = ""
    fetch(`${USERS_URL}/${message.user_id}`)
    .then(res => res.json())
    .then(json => {
        console.log(json.username)
    })
    // console.log(username)
    body.innerHTML += `<p data-id="${message.id}">${message.translation}</p>`
}

// How do we send the messages to the backend?
// Do we have one function to get the input then 
// translate on the backend then fetch the translation
// using another function?

function postMessage(){
    fetch(MESSAGES_URL, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }, 
        body: JSON.stringify()
    }).then(res => res.json())
}

function deleteChannel(e){
    let id = e.target.dataset.id
    e.target.parentElement.remove()
    fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    })
}

init()

})
