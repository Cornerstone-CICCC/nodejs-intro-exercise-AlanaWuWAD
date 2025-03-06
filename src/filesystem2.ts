import http from 'http'
import url from 'url'
import dotenv from 'dotenv'
import { createFile, deleteAFile, listFiles, readAFile } from './lib/fileFunc'
dotenv.config()

const server = http.createServer((req, res) => {
  const { method } = req

  // Allow CORS policy headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Pre-flight check
  if (method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  const parsedUrl = url.parse(req.url || '', true)
  const { pathname, query } = parsedUrl
  const fileName = query.filename as string | undefined
  
  // Home
  if (pathname === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Hello from my server!")
    return;
  }

  // Get list of files
  if (pathname === "/list" && method === "GET") {
    listFiles().then(data => {
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(data))
    }).catch(err => {
      console.error(err)
      res.writeHead(500, { "Content-Type": "text/plain" })
      res.end("Something went wrong...")
    })
    return
  }

  // Read file
  if (pathname === "/read" && fileName && method === "GET") {
    readAFile(fileName).then(data => {
      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end(data)
    }).catch(err => {
      console.error(err)
      res.writeHead(500, { "Content-Type": "text/plain" })
      res.end("Something went wrong...")
    })
    return
  }

  // Create file
  if (pathname === "/" && method === "POST") {
    let body = ""
    req.on("data", chunk => body += chunk)
    req.on("end", async () => {
      const { filename, fileContent } = JSON.parse(body)
      const success = await createFile(filename, fileContent)
      if (!success) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Error creating file")
        return
      }
      res.writeHead(201, { "Content-Type": "text/plain" })
      res.end("Successfully created file!")
    })
    return
  }

  // Delete file
  if (pathname === "/" && fileName && method === "DELETE") {
    deleteAFile(fileName).then(data => {
      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end("File deleted successfully...")
    }).catch(err => {
      console.error(err)
      res.writeHead(500, { "Content-Type": "text/plain" })
      res.end("Error deleting file...")
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
