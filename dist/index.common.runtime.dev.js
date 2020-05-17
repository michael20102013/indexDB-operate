


const databaseName = 'myFirstIndexDB';//字符串

const version = 22;//整数

let db;//数据库

let request;

let eventsArr = [];//事件中心

function myFirstIndexDB() {


}
myFirstIndexDB.prototype.open = function (options) {
    // let count = 0;
    return new Promise((resolve, reject) => {
        request = window.indexedDB.open(databaseName, version)
        request.onerror = function (e) {//失败
            console.log('打开数据库失败', e);
            reject(e);
        }


        request.onsuccess = function (e) {//成功
            db = request.result;
            resolve(e);
        }

        request.onupgradeneeded = function (e) {//升级
            db = e.target.result
            options.forEach((item, index, arr) => {
                if (!db.objectStoreNames.contains(item.storeName)) {//没有表则建表
                    let objStore = db.createObjectStore(item.storeName, { keyPath: 'id' });
                    item.data.forEach((it, index, arr) => {
                        Object.keys(it).forEach((itx, index, arr) => {
                            objStore.createIndex(
                                itx,//索引名称
                                itx, //索引所在的属性值
                                {
                                    unique: true//该属性是否包含重复的值
                                }
                            )
                        })
                    })

                }
            })
            let transcation = e.target.transaction;
            transcation.oncomplete = function (e) {
                console.log('建表完毕')
                resolve(db);
            }
        }

    })

}


myFirstIndexDB.prototype.add = function (options) {
    let count1 = 0;
    return new Promise((resolve, reject) => {
        options.forEach((item, index, arr) => {
            item.data.forEach((it, index, arr) => {
                let count2 = 0;
                let transaction = db.transaction([item.storeName], 'readwrite');
                let objStore = transaction.objectStore(item.storeName);
                let request = objStore.add(it);
                (function (request) {

                    request.onsuccess = function (e) {
                        count1++;
                        count2++;
                        if (count1 === options.length) {
                            resolve(e.target.result);
                        }
                    }

                    request.onerror = function (e) {
                        reject(e)
                    }

                })(request)
            })

        })
    })

}

myFirstIndexDB.prototype.read = function (idArr) {
    let count = 0;
    let rlt = [];
    return new Promise((resolve, reject) => {
        idArr.forEach((item, index, arr) => {
            let transaction = db.transaction([item.storeName]);

            let objStore = transaction.objectStore(item.storeName);
            let request = objStore.get(item.id);

            request.onerror = function (e) {
                console.log('事务失败', event)
                reject(e)
            }

            request.onsuccess = function (e) {
                rlt.push(request.result);
                count++;
                if (idArr.length === count) {
                    resolve(rlt);
                }
            }

        })
    })
}
myFirstIndexDB.prototype.readAll = function (storeNames) {
    let count = 0;
    let rlt = [];
    return new Promise((resolve, reject) => {
        storeNames.forEach((item, index, arr) => {
            let transaction = db.transaction([item]);

            let objStore = transaction.objectStore(item);
            let request = objStore.getAll();

            request.onerror = function (e) {
                reject(e)
            }

            request.onsuccess = function (e) {
                rlt.push(request.result);
                count++;
                if (storeNames.length === count) {
                    resolve(rlt);
                }
            }

        })
    })
}

myFirstIndexDB.prototype.update = function (storeName, record) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction([storeName], 'readwrite');
        let objStore = transaction.objectStore(storeName);
        let request = objStore.put(record);
        request.onsuccess = function (e) {
            // console.log('数据更新成功');
            resolve(`更新id:${e.target.result} 成功`);
        };

        request.onerror = function (e) {
            console.log('数据更新失败', e);
            reject(e);
        }
    })
}

myFirstIndexDB.prototype.delete = function (storeName, id) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction([storeName], 'readwrite');
        let objStore = transaction.objectStore(storeName);
        let request = objStore.delete(id);
        request.onsuccess = function (e) {
            console.log('数据删除成功');
            resolve(e.target.result);
        };

        request.onerror = function (e) {
            console.log('数据删除失败', e);
            reject(e);
        }
    })
}

myFirstIndexDB.prototype.findByIndex = function (storeName, index, value) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction([storeName], 'readwrite');
        let objStore = transaction.objectStore(storeName);
        let indexName = objStore.index(index);
        let request = indexName.get(value);
        request.onsuccess = function (e) {
            // console.log('数据查询成功', e.target.result);
            resolve(e.target.result);
        };

        request.onerror = function (e) {
            // console.log('数据查询失败', e);
            reject(e);
        }
    })
}

myFirstIndexDB.prototype.deleteDataBase = function (databaseName) {//删除指定数据库
    return new Promise((resolve, reject) => {

        if (db) {
            db.close();
        }
        let DBDeleteRequest = window.indexedDB.deleteDatabase(databaseName);
        DBDeleteRequest.onerror = function (e) {
            reject(e);
        };

        DBDeleteRequest.onsuccess = function (e) {
            resolve(e);
        };
    })

}
myFirstIndexDB.prototype.deleteObjectStore = function (storeName) {//删除指定仓库
    return new Promise((resolve, reject) => {
        if (db.objectStoreNames.contains(storeName)) {
            console.log(12312312312)
            let DBDeleteRequest = db.deleteObjectStore(storeName)


            DBDeleteRequest.onerror = function (e) {
                console.log(666)
                reject(e);
            };

            DBDeleteRequest.onsuccess = function (e) {
                resolve(e);
            };

        } else {
        }
    })

}



module.exports = myFirstIndexDB;



