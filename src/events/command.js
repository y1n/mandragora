import fs from 'node:fs/promises';

const commands = [];

const commands_path = './src/commands';
const command_files = await fs.readdir(commands_path);
const command_files_filtered = command_files.filter(f => f.endsWith('.js'));

for (const file of command_files_filtered) {
    const file_path = `.${commands_path.replace('/src','')}/${file}`;
    const command = (await import(file_path)).default;
    commands.push(command);
}

export default commands;