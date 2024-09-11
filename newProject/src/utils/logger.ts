const formatTime = () => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString();
  const fullFormattedDateTime = `${formattedDate} ${formattedTime} ${+now}`;
  return fullFormattedDateTime;
};

export class Logger {
  info(...args: any[]) {
    console.log(`[${formatTime()}]`, ...args);
  }
  warn(...args: any[]) {
    console.warn(`[${formatTime()}]`, ...args);
  }
}

export const log = new Logger();
