import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'
import dotenv from 'dotenv'
dotenv.config()

const directory = "docs"
const filePath = path.join(__dirname, "../", directory)

const server = http.createServer((req, res) => {
  const { method } = req
  const parsedUrl = url.parse(req.url || '', true)
  const { pathname, query } = parsedUrl
  const fileName = query.filename as string | undefined
  
  // Home
  if (pathname === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Hello from my server!")
    return;
  }

  // Read file
  if (pathname === "/read" && method === "GET") {
    fs.readFile(`${filePath}/${fileName}`, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Error reading file!")
        return
      }

      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end(data) // Send text content
    })
    return
  }

  // Create file
  if (pathname === "/create" && method === "POST") {
    let body = ""
    req.on("data", chunk => body += chunk)
    req.on("end", () => {
      fs.writeFile(`${filePath}/${fileName}`, body, err => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" })
          res.end("Error creating file")
          return
        }
  
        res.writeHead(201, { "Content-Type": "text/plain" })
        res.end("File created successfully!")
      })
    })
    return
  }

  // Delete file
  if (pathname === "/delete" && method === "DELETE") {
    fs.unlink(`${filePath}/${fileName}`, err => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Error deleting file...")
        return
      }

      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end("Successfully deleted file")
    })
    return
  }

  // Logger
  if (pathname === "/log") {
    fs.appendFile(filePath + "/log.txt", `${new Date()}\r\n`, err => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Error updating file")
        return
      }

      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end("Successfully updated log file!")
    })
    return
  }

  // 404 Fallback
  res.writeHead(404, { "Content-Type": "text/plain" })
  res.end("Not Found!")
  return
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})
