import { create } from 'zustand';
import { textToNode, TextItemType } from '@Utils/textToNode'

export { TextItemType }


type States = {
    textNodes: TextItemType[],
    currentNode: TextItemType | null,
    currentCategory: string,
    _updateEvents: ((nodes: TextItemType[]) => void)[]
};

type Actions = {
    clear: () => void,
    sync: (nodes: TextItemType[]) => void,
    syncValue: (v: string) => void,
    getValue: () => string,
    insertTextNode: (node: TextItemType) => void,
    insertTagNode: (node: TextItemType) => void,
    insertNode: (node: TextItemType) => void,
    deleteNode: () => void,
    selectNode: (node: TextItemType | null, category?: string) => void,
    onTextNodesUpdate: (cb: (nodes: TextItemType[]) => void) => void,
    _doUpdate: () => void
};

const isTextNode = (node: TextItemType) => {
    return node.type === 'text'
}


export const useInputStore = create<States & Actions>((set, get) => ({
    textNodes: [],
    currentCategory: 'expression',
    currentNode: null, // 当前编辑节点
    _updateEvents: [],
    insertTextNode(node: TextItemType) {
        const textNodes = get().textNodes
        const lastNode = textNodes[textNodes.length - 1]
        console.log('insertTextNode---', textNodes)
        if (!lastNode) { // 节点为空，直接插入
            set({
                textNodes: [node]
            })
            return
        }
        if (isTextNode(lastNode)) { // 上一个节点为文本节点
            console.log('replaceIndex', node.replaceIndex, lastNode.content)
            const newContent = node.replaceIndex ? lastNode.content.slice(0, 0 - node.replaceIndex) : lastNode.content
            const newTextNode = {
                ...lastNode,
                content: newContent + node.content
            }
            set({
                textNodes: textNodes.slice(0, -1).concat(newTextNode)
            })

            if (node.replaceIndex) { // 按需更新
                get()._doUpdate()
            }
            return
        }
        // 上一个节点为非文本节点
        set({
            textNodes: textNodes.concat(node)
        })
        console.log('insertTextNode---after', textNodes)

    },
    insertTagNode(node: TextItemType) {
        const textNodes = get().textNodes
        console.log('insertTagNode-----', textNodes)
        set({
            textNodes: textNodes.concat(node)
        })
        get()._doUpdate()
        console.log('insertTagNode-----after', textNodes)
    },
    syncValue(v: string) {
        console.log('[syncValue]', v)
        if (!v) return
        const nodes = textToNode(v);
        console.log('[syncValue nodes]', nodes)
        if (!nodes) return;
        get().sync(nodes)
    },
    getValue() {
        return get().textNodes.map(i => {
            if (i.type === 'text') {
                return i.content
            }
            return `<${i.type}:${i.content}>`
        }).join('')
    },
    sync(nodes: TextItemType[]) {
        set({
            textNodes: nodes
        })
    },
    insertNode(node: TextItemType) {
        console.log('insertNode', node, get().textNodes)
        if (isTextNode(node)) {
            get().insertTextNode(node)
        } else {
            get().insertTagNode(node)
        }
        console.log('insertNode after', node, get().textNodes)
    },
    deleteNode() { // 删除
        const textNodes = get().textNodes
        const lastNode = textNodes[textNodes.length - 1]
        if (!lastNode) return
        if (isTextNode(lastNode)) {
            const newContent = lastNode.content.slice(0, -1)
            if (newContent) {
                const newTextNode = {
                    ...lastNode,
                    content: lastNode.content.slice(0, -1)
                }
                set({
                    textNodes: textNodes.slice(0, -1).concat(newTextNode)
                })
                return
            }
        }
        // 删除标签
        set({
            textNodes: textNodes.slice(0, -1)
        })
        get()._doUpdate()
    },
    selectNode(node, category) {
        console.log('selectNode', node)
        if (node) {
            set({
                currentNode: node
            })
        }

        if (category) {
            set({
                currentCategory: category
            })
        }
    },
    clear() { // 清空
        set({
            textNodes: [],
            currentNode: null,
            currentCategory: 'expression',

        })
    },
    onTextNodesUpdate(cb: (nodes: TextItemType[]) => void) {
        get()._updateEvents.push(cb)
    },
    _doUpdate() {
        get()._updateEvents.forEach(ev => {
            ev(get().textNodes)
        })
    }
}));
