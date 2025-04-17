Promise.myAll = function (promises) {
    let arr = []
    let count = 0
    return new Promise((resolve, reject) => {
        promises.forEach((item, index) => {
            item.then((res) => {
                arr[index] = res
                count++
                if (count == promises.length) {
                    resolve(arr)
                }
            }, reject)

        })
    })
}

//缺少对于非promise数组项的处理，以及非数组的处理

Promise.myAll = function (promises) {
    if (!Array.isArray(promises)) {
        return Promise.reject(new TypeError('Argument must be an array'));
    }
    let arr = []
    let count = 0
    if (promises.length === 0) {
        return Promise.resolve(arr)
    }
    return new Promise((resolve, reject) => {
        promises.forEach((item, index) => {
            Promise.resolve(item).then((res) => {//使用resolve处理非promise值
                arr[index] = res
                count++
                if (count == promises.length) {
                    resolve(arr)
                }
            }, reject)

        })
    })
}



//使用all方法控制并发请求


const MAX_COUNT = 10
let urlArr = []
for (let i = 0; i < 100; i++) {
    urlArr.push(`https://jsonplaceholder.typicode.com/posts/${i}`)
}


const chunkArr = chunk(urlArr, MAX_COUNT)

function chunk(arr, size) {
    let res = []
    for (let i = 0; i < arr.length; i += size) {
        res.push(arr.slice(i, i + size))
    }
    return res
}

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        fetch(url).then(res => res.json()).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })

}

(async function () {
    try {
        for (let urls of chunkedUrls) {
            const promises = urls.map(url => fetchUrl(url));
            // 等待所有promises完成执行，并将结果存入results数组中
            const results = await Promise.all(promises);
            console.log('results:', results);
        }
    } catch (err) {
        console.error(err);
    }


}
)()