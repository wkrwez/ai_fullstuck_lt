// LRU 用到的结点
// Hash  key=> value
// 链表 结点 
// Hash链表 
class ListNode {
    constructor(key, val) {
        this.key = key; //？ O(1) key->
        this.val = val; // val
        this.pre = null; // pre
        this.next = null; // next 
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.size = 0;
        this.data = {} ; // hashMap  Map O(1)
        this.head = new ListNode();
        this.tail = new ListNode();
        this.head.next = this.tail;
        this.tail.pre = this.head;
    }
    put(key, val) {
        if (!this.data[key]) {
            // new
            let node = new ListNode(key, val);
            this.data[key] = node;
            // head 指针指向的是
            this.appendHead(node); // 
            this.size++;
            if (this.size > this.capacity) {
                const lastKey= this.removeTail()
                delete this.data[lastKey]
                this.size--
            }
        } else {
            // update
            let node = this.data[key];
            this.removeNode(node);
            node.val = val;
            this.appendHead(node);
        }
    }
    get(key) {
        if (!this.data[key]) return -1;
        else {
            let node = this.data[key];
            this.removeNode(node);
            this.appendHead(node);
            return node.val;
        }
    }
    appendHead(node) {
        let firstNode = this.head.next;
        this.head.next = node;
        node.pre = this.head;
        node.next = firstNode;
        firstNode.pre = node;
    }
    removeTail() {
        let key = this.tail.pre.key;
        this.removeNode(this.tail.pre)
        return key;
    }
    removeNode(node) {
        let preNode = node.pre;
        let nextNode = node.next;
        preNode.next = nextNode;
        nextNode.pre = preNode

    }
}