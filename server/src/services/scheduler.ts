/**
 * 简易定时任务调度器
 * 用于自动体检、报告生成等周期任务
 */

interface ScheduledTask {
  name: string;
  cron: string;
  lastRun: Date | null;
  handler: () => Promise<void>;
  enabled: boolean;
}

const tasks: ScheduledTask[] = [];

/** 注册定时任务 */
export function registerTask(name: string, cron: string, handler: () => Promise<void>) {
  tasks.push({ name, cron, lastRun: null, handler, enabled: true });
}

/** 解析简单 cron 表达式 (仅支持 "每N分钟" 格式) */
function parseSimpleCron(cron: string): number {
  const match = cron.match(/^\*\/(\d+)\s/);
  return match ? parseInt(match[1]) * 60 * 1000 : 3600000; // 默认1小时
}

/** 启动调度器 */
export function startScheduler() {
  console.log('⏰ 定时任务调度器已启动');

  // 每分钟检查一次
  setInterval(async () => {
    for (const task of tasks) {
      if (!task.enabled) continue;
      const interval = parseSimpleCron(task.cron);
      const now = Date.now();
      const lastRun = task.lastRun?.getTime() || 0;

      if (now - lastRun >= interval) {
        console.log(`⏰ 执行定时任务: ${task.name}`);
        try {
          await task.handler();
          task.lastRun = new Date();
        } catch (error) {
          console.error(`任务 ${task.name} 执行失败:`, error);
        }
      }
    }
  }, 60000);
}

/** 示例: 每日自动体检任务 */
export function registerAutoAudit(handler: () => Promise<void>) {
  registerTask('auto-audit', '*/1440 ', handler); // 每24小时
}

/** 示例: 每周报告生成 */
export function registerWeeklyReport(handler: () => Promise<void>) {
  registerTask('weekly-report', '*/10080 ', handler); // 每7天
}
