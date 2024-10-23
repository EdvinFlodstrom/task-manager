'use strict';

import dotenv from 'dotenv';
dotenv.config(); // Loads .env variables

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';
import process from 'process';
import configJson from '../config/config.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// If necessary, override storage with environment variables
const config = {
        ...configJson[env],
        storage:
                process.env[`${env.toUpperCase()}_DB_STORAGE`] ||
                configJson[env].storage,
};

const db = {};

let sequelize;
if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
        sequelize = new Sequelize(
                config.database,
                config.username,
                config.password,
                config,
        );
}

const modelFiles = fs.readdirSync(__dirname).filter((file) => {
        return (
                file.indexOf('.') !== 0 &&
                file !== basename &&
                file.slice(-3) === '.js' &&
                file.indexOf('.test.js') === -1
        );
});

for (const file of modelFiles) {
        const model = (await import(path.join(__dirname, file))).default(
                sequelize,
                Sequelize.DataTypes,
        );
        db[model.name] = model;
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize
        .sync({ alter: true })
        .then(() => {
                console.log('Database synced successfully.');
        })
        .catch((err) => {
                console.error('Error syncing the database.', err);
        });

export default db;
