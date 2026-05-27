1. # 场景(Scene)

### 属性

- new THREE.Scene()
- 背景色：scene.background = new THREE.Color(value);
  - value：'rgb’,'rgba','red','#fff','0xff0000'
  - 天空盒
- fog：雾效
  scene.fog = new THREE.Fog("#ffffff", start, end);
- position/rotation/scale
  scene.position.set(x,y,z)，position.y
  scene.rotation.set(x,y,z)，rotation.y

### 方法

- add() 添加模型、灯光、相机
- remove(mesh) 删除模型、灯光、相机
- getObjectByName('myBox') 通过名称获取对象
- traverse() 遍历场景所有子物体
- clear() 清空场景
- clone() 复制场景
- dispose() 释放场景
- copy() 复制场景
- toJSON() 导出场景JSON

### 来自Object3D的方法

- lookAt(x,y,z) 看向某个点
- rotateX/Y/Z(angle) 旋转场景
- attach(object) 附加物体
- getWorldPosition(target) 获取世界坐标
  const v = new THREE.Vector3()
  scene.getWorldPosition(v)

2. # 相机

## 透视相机（PerspectiveCamera）

- 模拟人眼观察事物的方式
  const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
- PerspectiveCamera( fov : number, aspect : number, near : number, far : number )
  - fov: 垂直视野角，视野角度，默认50
  - aspect: 宽高比，默认1
  - near: 摄像机视维体近视图，默认0.1
  - far: 摄像机视维体远视图，默认2000

3. # render

renderer.render(scene, camera)只渲染一次

4. # 轨道控制器 OrbitControls

使相机围绕目标进行轨道运动
const controls = new OrbitControls( camera, renderer.domElement );

### 下方属性设置1后需要controls.update();

- 当相机位置手动更改后，需要controls.update();
- controls.enableDamping = true; 阻尼，惯性运动
- controls.autoRotate = true; 自动旋转
  - controls.autoRotateSpeed = 0.5; 自动旋转速度
- 循环播放时需要连续controls.update();

```
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
```

5. # 几何体

- 平面几何体：PlaneGeometry(width, height, widthSegments, heightSegments)
  widthSegments:X轴方向的分段数
  heightSegments:Y轴方向的分段数
