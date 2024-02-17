#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const shelljs_1 = __importDefault(require("shelljs"));
const templates = fs_1.default.readdirSync(path_1.default.join(__dirname, '../templates'));
function copy(src, dest) {
    if (fs_1.default.lstatSync(src).isDirectory()) {
        fs_1.default.mkdirSync(dest);
        for (const file of fs_1.default.readdirSync(src)) {
            copy(path_1.default.join(src, file), path_1.default.join(dest, file));
        }
    }
    else {
        fs_1.default.copyFileSync(src, dest);
    }
}
inquirer_1.default
    .prompt([
    {
        type: 'input',
        name: 'project_name',
        message: "What's your project named?",
        default: function () {
            return 'my-backend';
        },
        validate: function (value) {
            var pass = value.match(/^[a-zA-Z0-9-_]+$/);
            if (!pass) {
                return 'Please enter a valid project name';
            }
            // Check if Folder Already exists and not empty
            if (fs_1.default.existsSync(value) && (fs_1.default.readdirSync(value).length > 0)) {
                return 'The project folder already exists. Please choose a different name.';
            }
            return true;
        }
    },
    {
        type: 'input',
        name: 'description',
        message: "What's your project about?",
        default: function () {
            return 'A simple backend project';
        }
    },
    {
        type: 'input',
        name: 'author',
        message: "What's your name?",
        default: function () {
            return 'John Doe';
        }
    },
    {
        type: 'confirm',
        name: 'is_private',
        message: 'Is this project private?',
        default: false
    },
    {
        type: 'list',
        name: 'template',
        message: 'What Template do you want to use?',
        choices: templates
    }
])
    .then(({ project_name, description, author, is_private, template }) => {
    console.log(`Creating a new Backend Project in ${project_name}`);
    // Make a new directory with the project name if not already exists
    if (!fs_1.default.existsSync(project_name))
        fs_1.default.mkdirSync(project_name);
    // Create a new package.json file with the project name
    let packageJSON = require(path_1.default.join(__dirname, '../templates', template, 'package.json'));
    packageJSON.name = project_name;
    packageJSON.description = description;
    packageJSON.author = author;
    packageJSON.private = is_private;
    fs_1.default.writeFileSync(`${project_name}/package.json`, JSON.stringify(packageJSON, null, 4));
    fs_1.default.copyFileSync(path_1.default.join(__dirname, '../templates', template, 'template.gitignore'), `${project_name}/.gitignore`);
    fs_1.default.copyFileSync(path_1.default.join(__dirname, '../templates', template, '.env.template'), `${project_name}/.env`);
    for (const file of fs_1.default.readdirSync(path_1.default.join(__dirname, '../templates', template))) {
        if (file === 'package.json' || file === 'template.gitignore')
            continue;
        copy(path_1.default.join(__dirname, '../templates', template, file), `${project_name}/${file}`);
    }
    // Install the necessary dependencies
    console.log("Installing dependencies...");
    shelljs_1.default.cd(project_name);
    shelljs_1.default.exec('npm install');
    console.log(chalk_1.default.green('Project created successfully!'));
})
    .catch((error) => {
    if (error.isTtyError) {
        console.error('Prompt couldn\'t be rendered in the current environment');
    }
    else {
        console.error(error);
    }
});
//# sourceMappingURL=index.js.map