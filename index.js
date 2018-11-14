document.addEventListener("DOMContentLoaded", () => {
const CHANNELS_URL = 'http://localhost:3000/channels'
const MESSAGES_URL = 'http://localhost:3000/messages'
const USERS_URL = 'http://localhost:3000/users'
const body = document.querySelector('body')
let id
let newMessage

function signin(){
    document.addEventListener("click", doThings)

    body.innerHTML = `<h1> Welcome! </h1>`
    body.innerHTML += `<button id="sign-in">Sign In</button>
    <button id="create-username">New User</button>`

    let signInButton = document.getElementById('sign-in')
    signInButton.addEventListener('click', signInUser)
}

function signInUser(e){
    body.innerHTML = `<h1>Please Enter Username</h1>
    <input id="enter-username"></input>
    <button id="submit-username">Submit</button>`
    let input = document.getElementById('enter-username')
    let button = document.getElementById('submit-username')
    button.addEventListener('click', function(){
        searchForUser(input.value)
    })
}

function searchForUser(value){
    fetch(USERS_URL)
    .then(res => res.json())
    .then(json => {
        for(let i in json){
            if(json[i].username === value){
                id = json[i].id
                init()
            } else {
                createNewUser
            }
        }
    })
}

function createNewUser(e){
    body.innerHTML = `<h1>Create New User</h1>
    <input id="enter-username"></input>
    <button id="submit-username">Submit</button>`

    let input = document.getElementById('enter-username')
    let button = document.getElementById('submit-username')
    button.addEventListener('click', function(){

    fetch(USERS_URL, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
            "Accepts": "application/json"
        }, 
        body: JSON.stringify({username: input.value})
        }).then(res => res.json())
        .then(json => {
            id = json.id
            init()
        })
    })
}

function init(){
    body.innerHTML = ` <h1>Channels</h1>
    <div>
        <ul id="channel-list">
        </ul>
    </div>

    <button>Create New Channel</button>`

    fetch(CHANNELS_URL)
    .then(res => res.json())
    .then(json => {
        json.forEach(displayChannel)
        })
}

function displayChannel(channel){

    const channelList = document.getElementById('channel-list')

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
    } else if(e.target.id === "get-speech"){
        getSpeech(e)
    } else if(e.target.id === 'submit-speech'){
        submitMessage(e)
    } else if(e.target.id === 'create-username'){
        createNewUser(e)
    }
}

function setChannel(e){
    console.log(id)
    let channelId = e.target.parentElement.dataset.id
    body.innerHTML = `<h1 data-id="${channelId}">${e.target.parentElement.id}</h1>
    <div id="message-list"></div>`

    fetch(`${CHANNELS_URL}/${channelId}`)
    .then(res => res.json())
    .then(json => {
        json.messages.forEach(showMessage)
    })

    body.innerHTML += `
    <div id="speech-content" data-id="${channelId}"><textarea id="speech-input"></textarea>
    <button id="get-speech">Speak</button>
    <button id="submit-speech">Translate</button></div>`
}

function getSpeech(e){
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      const recognition = new SpeechRecognition()
      recognition.interimResults = true

      let speech = document.getElementById('speech-input')
      let channelId = speech.parentElement.dataset.id

      recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

          speech.textContent = transcript
            newMessage = speech.value

          })
          
      recognition.start()
}

function postTranslation(){
    // console.log(e.target)
    console.log('bye')
}

function showMessage(message){
    let messageList = document.getElementById('message-list')
    // let messageUser
    fetch(`${USERS_URL}/${message.user_id}`)
    .then(res => res.json())
    .then(json => {
        messageList.innerHTML += `<h3>${json.username}</h3>
        <p data-id="${message.id}">${message.translation}</p>`
    })
}

function submitMessage(e){
    let channelId = e.target.parentElement.dataset.id
    fetch(MESSAGES_URL, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }, 
        body: JSON.stringify({user_id: id, channel_id: channelId, speech: newMessage})
    }).then(res => res.json())
    .then(showMessage)
}

function deleteChannel(e){
    let id = e.target.dataset.id
    e.target.parentElement.remove()
    fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    })
}

signin()

})
