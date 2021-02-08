function getConditionCollector() {
    const arr = [];
    return {
        get: function (url, func) {
            arr.push({url, func, method: 'GET'});
        },
        run: function (url, method) {
            let func = null;
            arr.forEach(elem => {
                if (elem.url === url && method === 'GET') {
                    func = elem.func;
                }
            })
            if (!func) {
                func = () => console.log('nothing...');
            }
            func();
        }
    }
}

const conditionCollector = getConditionCollector();
conditionCollector.get('/api/products', () => {
    console.log('get...');
})

conditionCollector.run('/api/products', 'GET');
