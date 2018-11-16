document.addEventListener("DOMContentLoaded", () => {
const CHANNELS_URL = 'http://10.39.107.235:3000/channels'
const MESSAGES_URL = 'http://10.39.107.235:3000/messages'
const USERS_URL = 'http://10.39.107.235:3000/users'
const body = document.querySelector('body')
let id
let newMessage
let username

function openConnection() {
    return new WebSocket("ws://10.39.107.235:3000/cable")
    // return new WebSocket("ws://10.39.109.17:3000/cable")
  }

  const chatWebSocket = openConnection()
  chatWebSocket.onopen = (event) => {
    const subscribeMsg = {"command":"subscribe","identifier":"{\"channel\":\"RoomChannel\"}"}
    chatWebSocket.send(JSON.stringify(subscribeMsg))
  }

  chatWebSocket.onmessage = event => {
    const result = JSON.parse(event.data)
    // console.log(typeof result.message)
    if(typeof result.message === "object"){
        showMessage(result.message)
    } 
  }

function welcome(){
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
                username = json[i].username
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
            username = json.username
            init()
        })
    })
}

function init(){
    body.innerHTML = ` <h1>Channels</h1>
    <div id="channel-container">
        <ul id="channel-list"></ul>
    </div>
    <blockquote class="blockquote">
        <div class="form-collection">
        </div>
        <button id="create-channel">Create New Channel</button>
    </blockquote>`

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
    } else if(e.target.id === 'create-channel'){
        createChannel(e)
    }
}

function createChannel(e){
    let div = document.getElementsByClassName('form-collection')
    // let createChannel = document.getElementById('create-channel')
    div.innerHTML += `<form id="create-new-channel" style=display:none>
        <div class="form-group">
            <label for="new-channel">Name of Channel</label>
            <input type="text" class="form-control" id="new-channel">
        </div>
        <div class="form-group">
            <label for="language" id="new-language">
            <input type="text" class="form-control" id="new-language">
        </div>
        <button type="submit" class="submit-btn"><Submit></button>
    </form>`

//    <form id="edit-quote-form" style=display:none>
//     <div class="form-group">
//       <label for="edit-quote">Edit Quote</label>
//       <input type="text" class="form-control" id="edit-quote" placeholder="Learn. Love. Code.">
//     </div>
//     <div class="form-group">
//       <label for="Author">Author</label>
//       <input type="text" class="form-control" id="edit-author" placeholder="Flatiron School">
//     </div>
//     <button type="submit" class="btn btn-primary">Submit</button>
//   </form>
//       <button class="edit-button">Edit</button>
//   </blockquote>
    console.log(div)
    newChannel(e)
}

function newChannel(e)[
    fetch(CHANNElS_URL, {
        method: "POST", 
        headers: {
            "Content-Type": 'application/json', 
            "Accept": 'application/json'
        }, 
        body: JSON.stringify({name: hello})
    }).then(res => res.json())
    .then(console.log)
]

function asd(e){
    // debugger
    if(e.target.previousElementSibling.style.display === "block"){
        e.target.previousElementSibling.style.display = "none"
    // document.getElementById("asd").style.display="none";
    } else {
        e.target.previousElementSibling.style.display = "block"
        // console.log('hi')
        createChannel(e)
    }
}

function setChannel(e){
    // console.log(id)
    let channelId = e.target.parentElement.dataset.id
    body.innerHTML = `<h1 data-id="${channelId}">${e.target.parentElement.id}</h1>
    <div id="message-list"></div>`

    fetch(`${CHANNELS_URL}/${channelId}`)
    .then(res => res.json())
    .then(json => {
        // console.log(json.messages)
        let sortedMessages = json.messages.sort(function(a, b){
            let dateA = new Date(a.created_at)
            let dateB = new Date(b.created_at)
            return dateA - dateB //sort by date ascending
        })
        // json.messages.sort(compare)
        sortedMessages.forEach(showMessage)
        console.log(sortedMessages)
    })

    // json.messages.sort(function(a, b){
    //     let dateA=new Date(a.created_at), dateB=new Date(b.created_at)
    //     return dateA-dateB //sort by date ascending
    // })

    body.innerHTML += `<div id="speech-content" data-id="${channelId}">
    <textarea id="speech-input"></textarea>
    <button id="get-speech">Speak</button>
    <button id="submit-speech">Translate</button></div>`
}

function compare(a, b){
    let dateA = new Date(a.created_at)
    let dateB = new Date(b.created_at)

    let comparison = 0 
    if(dateA > dateB){
        comparison = 1
    } else if (dateA < dateB){
        comparison = -1
    }
    return comparison
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

          console.log(transcript)
        // try something here
        speech.value = transcript
        newMessage = speech.value
    })

    recognition.start()

    recognition.onspeechend = (e) => {
        console.log(e)
        recognition.stop()
    }
}


function showMessage(message){
    let messageList = document.getElementById('message-list')
    let newDateTime = new Date(message.created_at).toLocaleString()
    console.log(newDateTime)
    console.log(message)

    messageList.innerHTML += `<h3>${message.username}</h3><p>${newDateTime}</p>
    <p data-id="${message.id}">${message.translation}</p>`
    // fetch(`${USERS_URL}/${message.user_id}`)
    // .then(res => res.json())
    // .then(json => {
    //     // console.log(message)
    //     messageList.innerHTML += `<h3>${json.username}</h3><p>${newDateTime}</p>
    //     <p data-id="${message.id}">${message.translation}</p>`
    // })
    // console.log(id)
}

function submitMessage(e){
    let channelId = e.target.parentElement.dataset.id
    let speechInput = document.getElementById('speech-input')
    speechInput.value = " "
   
    const msg = {
        "command":"message",
        "identifier":"{\"channel\":\"RoomChannel\"}",
        "data":`{
          \"action\": \"send_text\",
          \"speech\": \"${newMessage}\",
          \"user_id\": \"${id}\",
          \"channel_id\": \"${channelId}\",
          \"username\": \"${username}\"
        }`
      }
      
      chatWebSocket.send(JSON.stringify(msg))
    //   showNewMessage(newMessage)
    // fetch(MESSAGES_URL, {
    //     method: "POST", 
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Accept": "application/json"
    //     }, 
    //     body: JSON.stringify({user_id: id, channel_id: channelId, speech: newMessage})
    // })
    // showMessage()
}

function deleteChannel(e){
    let id = e.target.dataset.id
    e.target.parentElement.remove()
    fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    })
}

welcome()

})
