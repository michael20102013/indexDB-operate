# indexDB-operate


## 介绍
我们都知道前端的存储机制有cookie，webStorage，indeDB.其中indexDB是唯一基本不限存储上限的。但是我们都知道indexDB原生的api在使用上有很多不便，因此我基于indexDB封装了下这个工具库，方便indexDB的使用。

## 安装

如果你只想简单的使用，比如写个demo什么的，你可以拿到这个库的主文件`index.js`然后直接从页面引入。
就像这样：

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./src/index.js"></script>
</head>
<body>
    
</body>
</html>
```

如果你是工程化的前端项目，你可以通过npm包引入，就像这样：

```js
npm install indexdb-operate
```

然后在项目中这样引用：

```js
import indexDB_Operate from 'indexdb-operate';
```

## 例子：

如果在html中直接引入的话，可以这样：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        button {
            background-color: aqua;
            min-width: 100px;
            height: 50px;
        }
    </style>
    <script src="../../dist/index.js"></script>
</head>

<body>
    this is index.html

    <button id="add">add</button>
    <button id="delete">delete</button>
    <button id="deleteDataBase">deleteDataBase</button>
    <button id="deleteObjectStore">deleteObjectStore</button>
    <button id="update">update</button>
    <button id="get">get</button>
    <button id="getAll">getAll</button>
    <button id="findByIndex">findByIndex</button>

    <script>
        let scheme1 = [{
            storeName: 'person13', //表名
            data: [{ //要存的数据
                id: 1,
                name: 'wcx1',
                age: 29,
                email: 'wcx@qq.com'
            }]
        }, {
            storeName: 'person14', //表名
            data: [{ //要存的数据
                id: 2,
                name: 'wcx2',
                age: 29,
                email: 'wcx@qq.com'
            }]
        }]

        let scheme2 = [{
            storeName: 'person3', //表名
            _id: 1, //外键
            data: [{ //要存的数据
                id: 1,
                name: 'wcx1',
                age: 29,
                email: 'wcx@qq.com'
            }]
        }, {
            storeName: 'person4', //表名
            _id: 2, //外键
            data: [{ //要存的数据
                id: 2,
                name: 'wcx2',
                age: 29,
                email: 'wcx@qq.com'
            }]
        }]

        let idArr = [{
            storeName: scheme1[0].storeName,
            id: scheme1[0].data[0].id
        }, {
            storeName: scheme1[1].storeName,
            id: scheme1[1].data[0].id
        }];

        let storeNames = [scheme1[0].storeName, scheme1[1].storeName]

        document.querySelector("#add").addEventListener('click', async function() {
            let indexDB = new myFirstIndexDB();
            await indexDB.open(scheme1, 'myFirstIndexDB', 22);
            await indexDB.add(scheme1).then(v => {
                console.log('add', v)
            }).catch(e => {
                console.log('err', e)
            })
        })
        document.querySelector("#get").addEventListener('click', async function() {
            let indexDB = new myFirstIndexDB();
            await indexDB.open(scheme1, 'myFirstIndexDB', 22);
            await indexDB.read(idArr).then(v => {
                console.log('get', v)
            });
        })

        document.querySelector("#getAll").addEventListener('click', async function() {
            let indexDB = new myFirstIndexDB();
            await indexDB.open(scheme1, 'myFirstIndexDB', 22);
            await indexDB.readAll(storeNames).then(v => {
                console.log('所有的数据', v)
            });

        })

        document.querySelector("#update").addEventListener('click', async function() {
            let indexDB = new myFirstIndexDB();
            await indexDB.open(scheme1, 'myFirstIndexDB', 22);
            await indexDB.update(scheme1[0].storeName, {
                id: 1,
                name: 'wc',
                age: 29,
                email: 'wcx@qq.com'
            }).then(v => {
                console.log('update', v)
            })
        })

        document.querySelector("#delete").addEventListener('click', async function() {
            let indexDB = new myFirstIndexDB();
            await indexDB.open(scheme1, 'myFirstIndexDB', 22);
            await indexDB.delete(scheme1[0].storeName, 1)
        })
        document.querySelector("#deleteDataBase").addEventListener('click', async function() {
            let indexDB = new myFirstIndexDB();
            await indexDB.deleteDataBase('myFirstIndexDB').then(v => {
                console.log('删除数据库成功', v)
            }).catch(e => {
                console.log('删除数据库失败', e)
            })
        })
        document.querySelector("#deleteObjectStore").addEventListener('click', async function() {
            let indexDB = new myFirstIndexDB();
            await indexDB.open(scheme1, 'myFirstIndexDB', 22).then(v => {
                console.log('数据库打开成功')
            }).catch(e => {
                console.log('数据库打开失败', e)
            });
            await indexDB.deleteObjectStore(scheme1[0].storeName).then(v => {
                console.log('删除仓库成功', v)
            }).catch(e => {
                console.log('删除仓库失败', e)
            })
        })

        document.querySelector("#findByIndex").addEventListener('click', async function() {
            let indexDB = new myFirstIndexDB();
            await indexDB.open(scheme1, 'myFirstIndexDB', 22).then(v => {
                console.log('数据库打开成功')
            }).catch(e => {
                console.log('数据库打开失败', e)
            });

            await indexDB.findByIndex(scheme1[0].storeName, 'name', 'wc').then(v => {
                console.log('查询成功', v)
            })
        })
    </script>
</body>

</html>
```


如果在工程化的web项目中（比如vue-cli构建的项目）可以这样：


```js
import myFirstIndexDB from 'indexdb-operate';
//然后这个indexDB的使用就和上面的那个例子一模一样
```

API:

databaseName类型：一个字符串，表示数据的名称
scheme类型：一个对象数组，每个对象包含仓库名称和数据，数据也是一个包含多条记录的数组；
例子：

storeName类型：一个字符串，表示一个仓库（表）的名称；

version类型：一个整数，表示一个数据库的版本号；

id类型：一个整数，表示主键；
idArr类型： 一个由id组成的数组；

storeNames类型：一个由storeName类型组成的数组；

record类型：一个对象，表示一条记录，必须要有`id`字段；

index类型：一个字符串，表示一个索引；
```js
let scheme1 = [{
    storeName: 'person13', //表名
    data: [{ //要存的数据
        id: 1,
        name: 'wcx1',
        age: 29,
        email: 'wcx@qq.com'
    }]
}, {
    storeName: 'person14', //表名
    data: [{ //要存的数据
        id: 2,
        name: 'wcx2',
        age: 29,
        email: 'wcx@qq.com'
    }]
}]

```
| api  | 用途|参数说明    |例子        |
|------|----|------------|------------|
| open | 打开或创建数据库|接受3个参数，其中第一个参数必选，是一个scheme类型，第二个参数必选，是一个databaseName类型，第三个参数必选，是一个version类型，最后返回一个promise对象|参考上面的列子|
| add  | 用添加数据|接受一个scheme类型的参数    | 参考上面的列子|
| read  |用于查询数据 |接受一个idArr类型的参数| 参考上面的列子|
| readAll  |用于查询数据 |接受一个storeNames类型的参数| 参考上面的列子|
| update  |用于更新数据 |接受2个参数，第一个参数是storeName类型，第二个参数是record类型表示要更新的记录   | 参考上面的列子|
| delete  |用于删除数据 |接受2个参数，第一个参数是storeName类型，第二个参数是id类型| 参考上面的列子|
| findByIndex  |用于查询数据 |接受3个参数，第一个参数是storeName类型，第二个参数是index类型, 第三个参数表示index的值| 参考上面的列子|
| deleteDataBase  |用于删除数据库 |接受一个databaseName类型的参数| 参考上面的列子|
| deleteObjectStore  |用于删除数据库某个仓库名 |接受1个storeName类型的参数| 参考上面的列子|

