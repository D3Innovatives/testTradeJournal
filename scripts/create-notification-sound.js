import { writeFileSync } from 'fs'

// This is a base64-encoded short beep sound
const soundData = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFowCenp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6e//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAABaOxzk9IAAAAAAAAAAAAAAAAAAAA//tYxAAABLQDe7QQAAACD4O93oIAAEHwd7vQQAAIPg73eggAAQfB3u9BAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAAACXX//M0ZAAAAAP8AAAAAAAAAAAAAAAAAAAA//MUZAMAAAGkAAAAAAAAA0gAAAAAACXX//M0ZAAAAAP8AAAAAAAAAAAAAAAAAAAA'

// Convert base64 to buffer
const buffer = Buffer.from(soundData, 'base64')

// Write to file
writeFileSync('public/sounds/notification.mp3', buffer) 