// 通用存储工具
export const Storage = {
  // 获取数据
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  // 保存数据
  set: (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // 移除数据
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  // 生成唯一ID
  generateId: (prefix: string = 'id'): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

export default Storage;
