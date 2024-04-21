// 路径总和2

var pathSum = function(root, targetSum) {
    const res = []
    let stack = []
    

    function isTree(root,targetSum){
        if(root === null){
            return 
        }
        stack.push(root.val)
        targetSum = targetSum - root.val
        
        if(targetSum === 0 && root.left === null && root.right === null){
            res.push(stack.slice(0))
        }
        isTree(root.left,targetSum)
        isTree(root.right,targetSum)
        stack.pop()
    }
    isTree(root,targetSum)
    return res
};