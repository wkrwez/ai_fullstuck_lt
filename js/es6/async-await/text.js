function request(url) {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.onreadystatechange = function() {
        resolve(xhr.responseText)
      }
      xhr.send()
    })
  }
  
  // request('xxxxx').then((data) => {
  
  // })
  
  const res = await request('xxxxx')
  console.log(res);
  
  
  // fetch('xxxxxx')
  // .then((data) => {
  //   return data.json()
  // })
  // .then((res) => {
  
  // })\