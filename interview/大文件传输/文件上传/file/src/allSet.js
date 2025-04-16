const SIZE = 1024 * 1024

export default function App() {
    let uploadArr = []
    let map = new Map()
    let count = 0
    const handleFile = (e) => {
        const file = e.target.files[0]
        count = Math.ceil(file.size / SIZE); // 计算分片数量
        handleFileChunk(file.size, file)
    }

    async function handleFileChunk(size, file) {
        for (let start = 0; start < size; start += SIZE) {
            const chunkIndex = start / SIZE;
            if (uploadStatus.get(chunkIndex)?.success) continue;
            const chunk = file.slice(start, start + SIZE);

            uploadArr.push(uploadFile(chunk, chunkIndex, count, file.name))

            const result = await Promise.allSettled(uploadArr)
            result.forEach((item, index) => {
                if (item.status === 'fulfilled') {
                    map.set(index, { success: true })
                } else {
                    map.set(index, { success: false })
                }
            })
            const res = result.filter(item => item.status === 'rejected').map((r, i) => i);
            if (res.length > 0) {
                handleAgain(res, file, size)
            }
        }
    }

    const handleAgain = async (res, file, size) => {
        for (let chunkIndex of res) {
            const start = chunkIndex * SIZE;
            const chunk = file.slice(start, start + SIZE);
            try {
                await uploadFile(chunk, chunkIndex, Math.ceil(size / SIZE), file.name);
                uploadStatus.set(chunkIndex, { success: true });
            } catch (error) {
                uploadStatus.set(chunkIndex, { success: false });
            }
        }
    }

    const uploadFile = (chunk, chunkIndex, count, fileName) => {
        const formData = new FormData();
        formData.append('file', chunk, fileName); // 使用原始文件名
        formData.append('chunkIndex', chunkIndex);
        formData.append('count', count);
        // upload file
        const res = fetch('http://localhost:3000/upload/chunk', {
            method: 'POST',
            body: formData,
        }).then(response => {

            if (!response.ok) throw new Error("Failed to upload chunk");
            return response.json();
            // console.log(`Chunk ${chunkIndex + 1} of ${count} uploaded successfully`);
        }).catch(error => {
            console.error('Error uploading chunk:', error);
        });
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