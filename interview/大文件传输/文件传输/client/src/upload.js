import { useState, useRef, useEffect } from 'react';

export default function App() {
    const SIZE = 1024;
    const MAX_CONCURRENT = 4;
    const MAX_RETRIES = 3;

    // 状态管理
    const [allChunks, setAllChunks] = useState([]);         // 待上传分片队列
    const [activeChunks, setActiveChunks] = useState([]);   // 进行中的分片ID
    const [completedChunks, setCompletedChunks] = useState(new Set()); // 完成的分片
    const [failedChunks, setFailedChunks] = useState(new Set());       // 失败的分片
    const fileRef = useRef(null);                           // 文件引用

    // 初始化分片
    const initializeChunks = (file) => {
        const chunkNum = Math.ceil(file.size / SIZE);
        const chunks = [];
        for (let i = 0; i < chunkNum; i++) {
            const start = i * SIZE;
            const end = Math.min(start + SIZE, file.size);
            chunks.push({
                id: `${file.name}-${i}`,       // 唯一标识
                chunk: file.slice(start, end), // 文件切片
                retries: 0,                    // 重试次数
                index: i,                      // 分片序号
                fileName: file.name            // 原始文件名
            });
        }
        setAllChunks(chunks);
    };

    // 文件选择处理
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        fileRef.current = file;
        initializeChunks(file);
    };

    // 分片上传逻辑
    const uploadChunk = async (chunk) => {
        try {
            const formData = new FormData();
            formData.append('file', chunk.chunk);
            formData.append('fileName', chunk.fileName);
            formData.append('id', chunk.id);

            const response = await fetch('http://localhost:3001/upload/chunk', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            // 更新完成状态
            setCompletedChunks(prev => new Set([...prev, chunk.id]));
            return true;
        } catch (error) {
            // 重试逻辑
            if (chunk.retries >= MAX_RETRIES) {
                setFailedChunks(prev => new Set([...prev, chunk.id]));
                return false;
            }
            // 将分片重新加入队列前端
            setAllChunks(prev => [{ ...chunk, retries: chunk.retries + 1 }, ...prev]);
            return false;
        } finally {
            // 无论成功失败都移除进行中状态
            setActiveChunks(prev => prev.filter(id => id !== chunk.id));
        }
    };

    // 并发控制核心逻辑
    useEffect(() => {
        if (allChunks.length === 0) return;

        // 计算可用并发槽位
        const availableSlots = MAX_CONCURRENT - activeChunks.length;
        if (availableSlots <= 0) return;

        // 取出待上传分片
        const chunksToStart = allChunks.slice(0, availableSlots);

        // 原子更新状态
        setAllChunks(prev => prev.slice(availableSlots));
        setActiveChunks(prev => [...prev, ...chunksToStart.map(c => c.id)]);

        // 启动上传任务
        chunksToStart.forEach(chunk => {
            uploadChunk(chunk);
        });
    }, [allChunks, activeChunks.length]); // 依赖长度变化触发

    // 进度计算
    const totalChunks = fileRef.current
        ? Math.ceil(fileRef.current.size / SIZE)
        : 0;
    const progress = totalChunks > 0
        ? ((completedChunks.size + failedChunks.size) / totalChunks * 100).toFixed(2)
        : 0;

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                disabled={!!fileRef.current}
            />

            {fileRef.current && (
                <div className="upload-status">
                    <progress value={progress} max="100" />
                    <p>上传进度: {progress}%</p>
                    <div className="stats">
                        <span>成功分片: {completedChunks.size}/{totalChunks}</span>
                        <span>失败分片: {failedChunks.size}</span>
                    </div>
                    <button
                        onClick={() => initializeChunks(fileRef.current)}
                        disabled={failedChunks.size === 0}
                    >
                        重新上传失败分片
                    </button>
                </div>
            )}
        </div>
    );
}