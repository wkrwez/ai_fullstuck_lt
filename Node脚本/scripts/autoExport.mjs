import fs from 'fs-extra'

fs.readdir('./src/components')
.then(files => {
    if(Array.isArray(files)){
        let exportStr = ''
        files.forEach(item =>{
            if(
                fs.lstatSync(`./src/components/${item}`).isDirectory() && 
                /^[A-Z][a-zA-Z]*$/.test(item) &&
                fs.existsSync(`./src/components/${item}/index.tsx`)
            ){
                exportStr = `${exportStr}\nexport {default as ${item} } from './components/${item}';`
            }
            
        })
        fs.writeFile('./src/index.export.js',exportStr);
    }
})
.catch(
    err => console.error(err)
)