const js2xmlparser = require('js2xmlparser');

class ResponseFormat {
    constructor(res){
        this.res = res;
    }

    sendJson(data) {
        this.res.json(data);
    }

    sendXml(data){
        const xml = js2xmlparser.parse('response', data);
        this.res.set('Content-Type', 'application/xml').send(xml);
    }

    sendResponse(data, accept){
        if (accept.includes('application/json')) {
            this.sendJson(data);
        } else if (accept.includes('application/xml')) {
            this.sendXml(data);
        }
    }
}

module.exports = ResponseFormat;