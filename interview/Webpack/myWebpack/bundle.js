const fs = require('fs');
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const path = require('path')
const babel = require('@babel/core')


const getModuleInfo = (file) => { // 从某个路径加载路径下的文件代码
  const body = fs.readFileSync(file, 'utf8')
  const ast = parser.parse(body, {sourceType: 'module'})

  const deps = {}
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file)
      const absPath = './' + path.join(dirname, node.source.value)
      deps[node.source.value] = absPath
    }
  })

  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })

  const moduleInfo = {file, deps, code}
  return moduleInfo

}

const parseModules = (file) => { // 递归获取依赖
  const entry = getModuleInfo(file)
  const temp = [entry]  // entry >> main.js
  const depsGrash = {}

  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps
    if (deps) { // {'./add.js': './src/add.js', ...}
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]))
        }
      }
    }
  }

  temp.forEach(module => {
    depsGrash[module.file] = {
      deps: module.deps,
      code: module.code
    }
  })

  // console.log(depsGrash);
  return depsGrash
}

const bundle = (file) => {
  const depsGrash = JSON.stringify(parseModules(file))

  return `(function(grash) {
    function require(file) {

      function absRequire(relPath) {
        return require(grash[file].deps[relPath])
      }

      var exports = {};

      (function(require, exports, code) {
        eval(code)
      })(absRequire, exports, grash[file].code)

      return exports
    }
    require('${file}')

  })(${depsGrash})`

}


const content = bundle('./src/main.js')

fs.mkdirSync('./dist')
fs.writeFileSync('./dist/bundle.js', content)

// console.log(content);