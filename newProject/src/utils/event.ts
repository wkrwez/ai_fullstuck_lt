type Fn = {
  fn: (args: object | null | undefined) => void;
  once?: boolean;
};
type EventType = {
  [key: string]: Fn[] | undefined;
};
export class Event {
  eventlist: EventType = {};

  on(key: string, fn: (args: any) => void, once?: boolean) {
    if (!this.eventlist[key]) this.eventlist[key] = [];

    this.eventlist[key].push({
      fn,
      once
    });
  }
  emit(key: string, args?: object) {
    if (this.eventlist && this.eventlist[key]) {
      this.eventlist[key].forEach(fn => {
        fn.fn(args);
      });
      this.eventlist[key] = this.eventlist[key].filter(item => !item.once);
      return true;
    } else {
      return false;
    }
  }
  off(key: string, fn?: (args: any) => void) {
    if (fn) {
      const index = this.eventlist[key]?.findIndex(item => item.fn === fn);
      if (index !== undefined && index !== -1) {
        this.eventlist[key]?.splice(index, 1);
      }
    } else {
      this.eventlist[key] = [];
    }
  }
  checkListenersCount(key: string) {
    return this.eventlist[key]?.length;
  }
}
