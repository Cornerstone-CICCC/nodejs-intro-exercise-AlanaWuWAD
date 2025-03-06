import http from "http"
import dotenv from 'dotenv' // Import dotenv package
dotenv.config() // Reads .env file

const server = http.createServer((request, response) => {

    //Home
    if (request.url === "/") {
        response.writeHead(200, { 'Content-type': 'text/html' })
        response.end(`<h1>Home</h1>`)
        return;
    }

    //About
    if (request.url === "/about") {
        response.writeHead(200, { 'Content-type': 'text/html' })
        response.end(`<h1>About</h1>`)
        return;
    }

    //My Account
    if (request.url === "/my-account") {
        response.writeHead(403, { 'Content-type': 'text/plain' })
        response.end(`You have no access to this page`)
        return;
    }

    // 404 Fallback
    response.writeHead(404, { "Content-Type": "text/plain" })
    response.end("Page not found")
    return;
})

const PORT = process.env.BACKEND_PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})