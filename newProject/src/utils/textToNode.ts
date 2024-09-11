export interface TextItemType {
    type: string,
    content: string,
    replaceIndex?: number
}


export const textToNode = (text: string): (TextItemType[] | null) => {
    const result = [];
    const pattern = /<(\w+):([^>]+)>/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
        const tagType = match[1];
        const tagContent = match[2];
        const textBeforeTag = text.slice(lastIndex, match.index);

        if (textBeforeTag) {
            const textNodes = textBeforeTag.split('').map(i => ({ type: 'text', content: i }))
            textNodes.forEach(item => {
                result.push(item);
            })
        }

        result.push({ type: tagType, content: tagContent });

        lastIndex = match.index + match[0].length;
    }

    // 添加剩余的文本部分到结果中
    const textAfterLastTag = text.slice(lastIndex);
    if (textAfterLastTag) {
        // result.push({ type: 'text', content: textAfterLastTag });
        const textNodes = textAfterLastTag.split('').map(i => ({ type: 'text', content: i }))
        textNodes.forEach(item => {
            result.push(item);
        })
    }

    return result;
}