const SIZE = 1024 * 1024

export default function App() {
  let uploadStatus = new Map()
  const handleFile = (e) => {
    const file = e.target.files[0]
    handleFileChunk(file.size, file)
  }

  async function handleFileChunk(size, file) {


    const chunks = Math.ceil(size / SIZE); // 计算分片数量
    for (let start = 0; start < size; start += SIZE) {
      const chunkIndex = start / SIZE;
      // 如果该分片已经上传成功，则跳过
      if (uploadStatus.get(chunkIndex)?.success) continue;

      const chunk = file.slice(start, start + SIZE);
      try {
        if (chunkIndex === 1) { // 假设我们想让第3个分片（索引为2）上传失败
          throw new Error("Simulated failure for chunk " + chunkIndex);
        }
        await uploadFile(chunk, chunkIndex, chunks, file.name);
        uploadStatus.set(chunkIndex, { success: true }); // 更新上传状态
      } catch (error) {
        console.error(`Failed to upload chunk ${chunkIndex}, error:`, error);
        uploadStatus.set(chunkIndex, { success: false }); // 标记为失败
      }
    }
  }

  const uploadFile = (chunk, chunkIndex, chunks, fileName) => {
    const formData = new FormData();
    formData.append('file', chunk, fileName); // 使用原始文件名
    formData.append('chunkIndex', chunkIndex);
    formData.append('chunks', chunks);
    // upload file
    const res = fetch('http://localhost:3000/upload/chunk', {
      method: 'POST',
      body: formData,
    }).then(response => {

      if (!response.ok) throw new Error("Failed to upload chunk");
      return response.json();
      // console.log(`Chunk ${chunkIndex + 1} of ${chunks} uploaded successfully`);
    }).catch(error => {
      console.error('Error uploading chunk:', error);
    });
    console.log(res);

  }
  const handleStart = () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return
    handleFileChunk(file.size, file)
  }
  return (
    <div>
      <input type="file" id='fileInput' onChange={handleFile} />
      <button onClick={handleStart}>重新上传</button>
    </div>
  )
}
// import React, { useEffect, useState } from "react"
// export default function App() {

//   const [value, setValue] = useState(1)
//   console.log(b, '全局')

//   useEffect(() => {
//     console.log(value, 'useEffect')
//     setValue(2)
//   }, [])

//   var b = 8
//   console.log(b - value, '计算')
//   return (
//     <div>
//       {value}
//     </div>
//   )
// }