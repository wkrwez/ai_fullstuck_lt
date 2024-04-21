// 路径总和

var hasPathSum = function(root, targetSum) {
    let sum = 0
  
    function isTree(root){
        if(root===null){
            return  false
        }
        sum = root.val + sum
        if(sum===targetSum && root.left === null && root.right === null){
            return true
        }
        if(isTree(root.left)||isTree(root.right)){
          return true
        }
        sum -=root.val
        return false
    }
    
    return isTree(root)
  };
  let root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
  
  hasPathSum(root,targetSum)