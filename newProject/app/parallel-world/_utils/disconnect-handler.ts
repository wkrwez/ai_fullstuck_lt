import { Socket } from '@/src/api/websocket';
import { showToast } from '@/src/components';

// 定义 DisconnectFn 函数的类型
type DisconnectFn = () => void;

export class DisconnectHandler {
  private disconnect: DisconnectFn;

  constructor(disconnect: DisconnectFn) {
    this.disconnect = disconnect;
    // 必须绑定以确保正确的 this 上下文
    this.offlineEvent = this.offlineEvent.bind(this);
  }

  // 网络错误事件处理方法
  private offlineEvent(): void {
    this.disconnect();
    showToast('当前网络信号差，请重试~');
  }

  // 注册 disconnect 事件监听器
  public onDisconnect(): void {
    Socket.events.on('disconnect', this.offlineEvent, true);
  }

  // 取消注册 disconnect 事件监听器
  public offDisconnect(): void {
    Socket.events.off('disconnect', this.offlineEvent);
  }
}
