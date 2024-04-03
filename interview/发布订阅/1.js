const emiter = new EventEmitter()

emiter.on('onSell',()=>{
    console.log('我去买房');
})

emiter.on('onSell',()=>{
    console.log('他去买房');
})