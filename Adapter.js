const Adapter = {
    index: () => fetch(someURL).then(res => res.json()),
    create: (id, body) => fetch(someURL).then(res =>res.json()),
    update: (id, body) => fetch(someURL/users/id, {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
}

// link in index.html above index.js file
Adapter.update(id, {message: 'hello world'})
.then()