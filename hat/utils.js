module.exports.getEnvValues = () => {
    const result = require('dotenv').config()

    if (result.error) {
        throw result.error
    }

    return result.parsed
}

module.exports.getJSONString = (object, type = '') => {
    if (type === '') {
        return JSON.stringify(object, null, '\t');
    }
    return JSON.stringify(object,
        (k, v) => {
            console.log(typeof v)
            if (typeof v === 'object' || typeof v === type) {
                return v;
            }
            return undefined;
        },
        '\t')
}

class DFO {
    constructor(file) {
        this.fs = require("fs");
        this.file = file;
        this.writed = false;
    }

    readData() {
        if (this.writed) {
            this.writed = false;
            return this.data;
        }
        let data = null;
        try {
            data = this.fs.readFileSync(this.file, "utf8");
        } catch (e) {
            this.fs.open(this.file, 'w', (err) => {
                if (err) throw err;
            });
        }
        return data;
    }

    writeData(data) {
        this.fs.writeFile(this.file, data, function (error) {
            if (error) throw error;
        });
        this.data = data;
        this.writed = true;
    }
}

module.exports.DFO = DFO;

/**
 * Для получения имени файла для логирования из параметров консоли
 * @returns {string}
 */
module.exports.getLogFile = (defaultFile = null) => {
    const argv = require('minimist')(process.argv.slice(2));
    let logFile = 'log.txt';
    if (defaultFile === null) {
        if (Object.keys(argv['_']).length) {
            logFile = argv['_'][0];
        }
    }
    return logFile;
}