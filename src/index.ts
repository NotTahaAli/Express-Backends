#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import shell from 'shelljs';

const templates = fs.readdirSync(path.join(__dirname, '../templates'));

function copy(src: string, dest: string) {
    if (fs.lstatSync(src).isDirectory()) {
        fs.mkdirSync(dest);
        for (const file of fs.readdirSync(src)) {
            copy(path.join(src, file), path.join(dest, file));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

inquirer
    .prompt([
        {
            type: 'input',
            name: 'project_name',
            message: "What's your project named?",
            default: function () {
                return 'my-backend'
            },
            validate: function (value) {
                var pass = value.match(
                    /^[a-zA-Z0-9-_]+$/
                );
                if (!pass) {
                    return 'Please enter a valid project name';
                }
                // Check if Folder Already exists and not empty
                if (fs.existsSync(value) && (fs.readdirSync(value).length > 0)) {
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
                return 'A simple backend project'
            }
        },
        {
            type: 'input',
            name: 'author',
            message: "What's your name?",
            default: function () {
                return 'John Doe'
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
    .then(({ project_name, description, author, is_private, template }: { project_name: string, description: string, author: string, is_private: boolean, template: string }) => {
        console.log(`Creating a new Backend Project in ${project_name}`);

        // Make a new directory with the project name if not already exists
        if (!fs.existsSync(project_name)) fs.mkdirSync(project_name);

        // Create a new package.json file with the project name
        let packageJSON = require(path.join(__dirname, '../templates', template, 'package.json'));
        packageJSON.name = project_name;
        packageJSON.description = description;
        packageJSON.author = author;
        packageJSON.private = is_private;
        fs.writeFileSync(`${project_name}/package.json`, JSON.stringify(packageJSON, null, 4));
        fs.copyFileSync(path.join(__dirname, '../templates', template, 'template.gitignore'), `${project_name}/.gitignore`);
        fs.copyFileSync(path.join(__dirname, '../templates', template, '.env.template'), `${project_name}/.env`);

        for (const file of fs.readdirSync(path.join(__dirname, '../templates', template))) {
            if (file === 'package.json' || file === 'template.gitignore') continue;
            copy(path.join(__dirname, '../templates', template, file), `${project_name}/${file}`);
        }

        // Install the necessary dependencies
        console.log("Installing dependencies...");
        shell.cd(project_name);
        shell.exec('npm install');

        console.log(chalk.green('Project created successfully!'));
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.error('Prompt couldn\'t be rendered in the current environment');
        } else {
            console.error(error);
        }
    });