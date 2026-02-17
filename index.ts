#!/usr/bin/env node

import { parseArgs } from "node:util";
import path, { basename } from "node:path";
import { existsSync, writeFileSync } from "node:fs";
import { spawnSync, type SpawnOptions } from "node:child_process";
import gitignoreContent from "./.gitignore" with { type: "text" }

const { positionals } = parseArgs({ allowPositionals: true });
const serverUrlIdx = positionals.findIndex(it => it.match(/\S+:\/\//))
if (serverUrlIdx === -1) throw new Error('缺少svn服务地址')
const serverUrl = positionals[serverUrlIdx]
const localDir = path.resolve(positionals[serverUrlIdx - 1] || process.cwd())
if (!existsSync(localDir)) throw new Error(`本地路径不存在: ${localDir}`)
const serverDir = positionals[serverUrlIdx + 1] || basename(localDir)

process.chdir(localDir)

const gitignore = '.gitignore'
if (!existsSync(gitignore)) writeFileSync(gitignore, gitignoreContent)
if (existsSync('.svn')) throw new Error('当前目录已经被初始化过了,可以直接提交,如 `svn commit . -m "批量更新"`')

const serverFullUrl = `${serverUrl!.replace(/\/$/, '')}/${serverDir}`
console.log(`准备导入: ${localDir} → ${serverFullUrl}`);
/**
 * TODO
 * 测试目录里面有很多嵌套的子项目; 就如ebase; 会把子项目的文件上传马
 */

const cmds = [
    // local直接是当前cwd,或者手动指定一个路径
    // 1. 先导入一个临时文件占个位置文件 .gitignore/没有的话临时创建一个文件事成之后在删除
    // svn import yourfile.txt http://svn.example.com/repo/trunk/project/yourfile.txt -m "导入单个文件"
    `svn import -m "导入临时占位文件"  ${gitignore}  ${serverFullUrl}/${gitignore}`,
    // 2. checkout " .
    `svn checkout  --depth empty ${serverFullUrl} .`,
    // `svn checkout  "${serverFullUrl}" ./`,
    // 3. 添加忽略文件 
    `svn propset svn:global-ignores -F .gitignore . --recursive`,
    `svn resolve --accept working ./.gitignore`,
    // 4. 添加所有文件 
    `svn add --force .  `,
    // 5. 忽略 临时文件
    // `svn delete --force ${tmpFile.name}`,
    // 6. 提交 
    `svn commit -m "新增项目${serverDir}"`
]
cmds.forEach(cmd => {
    console.info('执行命令 ', `[${cmd}]`)
    const res = crossSpawnExec(cmd)
    if (res.status) process.exit(0)
})

function crossSpawnExec(cmd: string, options?: SpawnOptions) {
    let [bin, ...params] = cmd.trim().split(/\s+/)
    if (!bin) throw new Error('执行命令有误')
    if (process.platform === 'win32') {
        params.unshift('-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', bin)
        bin = 'powershell.exe'
    }
    return spawnSync(bin, params, { stdio: 'inherit', ...options })
}