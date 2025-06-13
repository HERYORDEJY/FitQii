// For Make Log on Develop Mode
export const logOnDev = (...message: Array<any>) => {
  if (__DEV__) {
    console.log(`✅[${new Date().toISOString()}] ${message.join(" ")}`);
  }
};

// Error log on Develop Mode
export const errorLogOnDev = (...message: Array<any>) => {
  if (__DEV__) {
    console.error(`🚨[${new Date().toISOString()}] ${message.join(" ")}}`);
  }
};

// Warning Log on Develop Mode
export const warnLogOnDev = (...message: Array<any>) => {
  if (__DEV__) {
    console.warn(`⚠️[${new Date().toISOString()}]${message.join(" ")}}`);
  }
};
