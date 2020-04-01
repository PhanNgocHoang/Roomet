const io = require('socket.io')(3000);
const arrUser = []
io.on('connection', socket=>{
   socket.on('UserName', user=>{
       const isExist = arrUser.some(e => e.user === user.ten)
       socket.peerId = user.peerId
       if(isExist){
            return socket.emit('DangKyFail')
       }
        arrUser.push(user)
       socket.emit('Danhsach', arrUser)
       socket.broadcast.emit('NewUser', user)
   })
   socket.on('disconnect', ()=>{
        const index = arrUser.findIndex(user => user.peerId === socket.peerId)
        arrUser.splice(index, 1)
        io.emit('NgatKetNoi', socket.peerId)
   })
})