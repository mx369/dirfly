import { execSync, type SpawnOptions, spawnSync } from 'child_process';
import { statSync } from 'fs';
import readline from 'readline'
/**
 * ⚠️ 提示用户危险操作并返回 Promise
 * @param message 提示信息
 * @returns Promise<boolean> 用户输入 y 返回 true，否则 false
 */
export function confirmDanger(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        logError('⚠️  ⚠️  ⚠️  警告 ⚠️  ⚠️  ⚠️');
        logError(message);

        rl.question('请输入 y 继续操作，其他键取消\n', (answer: string) => {
            rl.close();
            if (answer.toLowerCase() === 'y') {
                resolve(true);
            } else {
                logError('❌ 已取消操作！');
                resolve(false);
            }
        });
    });
}

export function crossSpawnExec(cmd: string, options?: SpawnOptions) {
    let [bin, ...params] = cmd.trim().split(/\s+/)
    if (!bin) throw new Error('执行命令有误')
    if (process.platform === 'win32') {
        params.unshift('-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', bin)
        bin = 'powershell.exe'
    }
    return spawnSync(bin, params, { stdio: 'inherit', ...options })
}

export function revertEmptyDir() {
    const res = execSync(`svn status`)

    const lines = res.toString().split('\n')
    const maybeEmpty = lines.filter((line, idx) => {
        const nextLine = lines[idx + 1] || ''
        return !nextLine.startsWith(line) && line.startsWith('A') && statSync(line.split(' ').pop()!).isDirectory()
    })
    if (!maybeEmpty.length) return
    console.warn(`[${maybeEmpty.length}] 以下目录为空:已经自动过滤(有可能是文件忽略造成的)\n`, maybeEmpty.join('\n'))
    execSync(`svn revert ${maybeEmpty.join(' ')}`)
}


export const logInfo = (...args: any[]) => colorLog('gray', ...args)
export const logError = (...args: any[]) => colorLog('red', ...args)
export function colorLog(color: keyof typeof colorLog.col, ...args: any[]) {
    console.log(colorLog.col[color] + args.join(' ') + colorLog.reset);
}
colorLog.reset = '\x1b[0m';
colorLog.col = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[2;90m',
    bgRed: '\x1b[41m',
    bright: (s: string) => `\x1b[1m${s}${colorLog.reset}`,
} as const;