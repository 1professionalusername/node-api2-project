const express = require('express')
const postsRouter = require('./routers/post-router.js');


const server = express()
server.use(express.json())


server.use('/api/posts', postsRouter)
//server.use("/users, usersRouter")
server.listen(8080, () => console.log('server on port 8080'))