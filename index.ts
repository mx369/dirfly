#!/usr/bin/env node

import { parseArgs } from "node:util";
import path, { basename } from "node:path";
import { existsSync, rm, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import gitignoreContent from "./.gitignore" with { type: "text" }
import { confirmDanger, crossSpawnExec, revertEmptyDir } from "./help";

const { positionals } = parseArgs({ allowPositionals: true });
const serverUrlIdx = positionals.findIndex(it => it.match(/\S+:\/\//))
if (serverUrlIdx === -1) throw new Error('缺少svn服务地址')
const serverUrl = positionals[serverUrlIdx]
const localDir = path.resolve(positionals[serverUrlIdx - 1] || process.cwd())
if (!existsSync(localDir)) throw new Error(`本地路径不存在: ${localDir}`)
const serverDir = positionals[serverUrlIdx + 1] || basename(localDir)
const serverFullUrl = `${serverUrl!.replace(/\/$/, '')}/${serverDir}`

confirmDanger([`1. 服务器文件夹会被清空,再上传[${serverFullUrl}]`, `2. 文件[${path.resolve('.svn')}]如果存在也会被删除`].join('\n'))
    .then(res => res && main())

function main() {

    process.chdir(localDir)

    const gitignore = '.gitignore'
    if (!existsSync(gitignore)) writeFileSync(gitignore, gitignoreContent)
    if (existsSync('.svn')) rm('.svn', { recursive: true, force: true }, console.log)

    console.log(`准备导入: ${localDir} → ${serverFullUrl}`);
    try {
        execSync(`svn delete "${serverFullUrl}}" -m "清除已有文件"`, { stdio: 'pipe' });
    } catch {
    }
    const cmds = [
        // local直接是当前cwd,或者手动指定一个路径
        // 1. 先导入一个临时文件占个位置文件 .gitignore/没有的话临时创建一个文件事成之后在删除
        // svn import yourfile.txt http://svn.example.com/repo/trunk/project/yourfile.txt -m "导入单个文件"
        { cmd: `svn delete -m "清除已有文件" ${serverFullUrl} `, ignoreErr: true },
        `svn import -m "导入临时占位文件"  ${gitignore}  ${serverFullUrl}/${gitignore}`,
        // 2. checkout " .
        `svn checkout  --depth empty ${serverFullUrl} .`,
        // 3. 添加忽略文件 
        `svn propset svn:global-ignores -F .gitignore . --recursive`,
        // 4. 添加所有文件 
        `svn add --force .  `,
        { fn: revertEmptyDir },
        // 5. 忽略 临时文件
        // `svn delete --force ${tmpFile.name}`,
        // 6. 提交 
        `svn commit -m "新增项目${serverDir}"`
    ]
    cmds.forEach(cmd => {
        const [_cmd, ignoreErr, fn] = typeof cmd !== 'string' ? [cmd.cmd, cmd.ignoreErr, cmd.fn] : [cmd]
        if (!_cmd) return fn?.()
        console.info('执行命令\n ', _cmd)
        const res = crossSpawnExec(_cmd)
        if (!ignoreErr && res.status) process.exit(0)
    })

}