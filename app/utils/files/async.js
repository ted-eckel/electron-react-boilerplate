import { readdir, readFile, stat, writeFile, rename } from 'fs'

export const readdirAsync = folder => new Promise((resolve, reject) => {
  readdir(folder, (err, data) => {
    if (err) return reject(err)
    resolve(data)
  })
})

export const readFileAsync = file => new Promise((resolve, reject) => {
  readFile(file, (err, data) => {
    if (err) return reject(err)
    resolve(data)
  })
})

export const statAsync = filePath => new Promise((resolve, reject) => {
  stat(filePath, (err, data) => {
    if (err) return reject(err)
    resolve(data)
  })
})

export const writeFileAsync = (path, content) => new Promise((resolve, reject) => {
  writeFile(path, content, err => {
    if (err) return reject(err)
    resolve(content)
  })
})

export const renameAsync = (oldPath, newPath) => new Promise((resolve, reject) => {
  rename(oldPath, newPath, err => {
    if (err) return reject(err)
    resolve(newPath)
  })
})
