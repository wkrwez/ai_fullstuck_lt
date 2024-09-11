import "reflect-metadata";
class MyClass {
  private myProperty: string;
  constructor(value: string) {
    this.myProperty = value;
  }
  @Reflect.metadata("customkey", "customValue") //语法糖，简化元数据操作
  myMethod() {
    console.log("Executing myMethod");
  }
}
const instance = new MyClass("hello");
//给instance上的myProperty定义一个元数据，属性是key1,值是value1
Reflect.defineMetadata("key1", "value1", instance, "myProperty");
//检查是否具有指定的元数据
// const hasMetadata = Reflect.hasMetadata("key1", instance, "myProperty");
// console.log(`Has metadata key1 for myProperty:${hasMetadata}`);
//获取元数据
// const metadataValue = Reflect.getMetadata("key1", instance, "myProperty");
// console.log(` Metadata key1 value for myProperty :${metadataValue}`);
//获取自有元数据(针对方法)
const ownMetaDataValue = Reflect.getOwnMetadata(
  "customkey",
  Reflect.getPrototypeOf(instance),
  "myMethod"
);
const ownMetaDataValue2 = Reflect.getMetadata(
  "customkey",
  instance,
  "myMethod"
);
console.log(ownMetaDataValue);
console.log(ownMetaDataValue2);
