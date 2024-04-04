const http = require('http');
const fs = require('fs');
const path = require('path');

function rewriteImport(content) {
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, function (s0, s1) {  // from 'vue'
        if (s1[0] !== '.' && s1[1] !== '/') { // 从node_modules中来的
            return `from '/@modules/${s1}'`
        } else {
            return s0
        }
    })
}


const server = http.createServer((req, res) => {
    const { url, query } = req

    if (url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        let content = fs.readFileSync('./index.html', 'utf8')
        res.end(content)
    } else if (url.endsWith('.js')) {  //   /src/main.js
        const p = path.resolve(__dirname, url.slice(1))  // xxxx/src/main.js
        res.writeHead(200, {
            'Content-Type': 'application/javascript'
        })
        const content = fs.readFileSync(p, 'utf8')
        res.end(rewriteImport(content))
    } else if (url.startsWith('/@modules')) {
        const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@modules/', ''))  // vue
        const module = require(prefix + '/package.json').module
        const p = path.resolve(prefix, module)
        const content = fs.readFileSync(p, 'utf8')
        res.writeHead(200, {
            'Content-Type': 'application/javascript'
        })
        res.end(rewriteImport(content))
    }

})

server.listen(5173, () => {
    console.log('listening on port 5173');
})