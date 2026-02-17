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

        console.log('⚠️  ⚠️  ⚠️  警告 ⚠️  ⚠️  ⚠️');
        console.log(message);

        rl.question('请输入 y 继续操作，其他键取消', (answer: string) => {
            rl.close();
            if (answer.toLowerCase() === 'y') {
                resolve(true);
            } else {
                console.log('❌ 已取消操作！');
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