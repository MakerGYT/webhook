const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const { httpPort, mysqlConfig } = require('./config');

const app = express();
app.use(bodyParser.json());
app.use('/', express.static('public'))

const requestIp = require('request-ip');

var connection = mysql.createConnection(mysqlConfig);
connection.connect();
const table = 'goods';
/**
 * 新增接口
 * @param:
 * @return:
 */
app.get('/add', function (req, res) {
  var data = req.query;
  var addSql = 'INSERT INTO ' + table + '(Id,name,remainder,time) VALUES(0,?,?,?)';
  var addSqlParams = [data.name, data.remainder, new Date()];
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('INSERT ID:', result);
    res.send(result);
  });

})
/**
 * 更新接口
 * @param:
 * @return:
 */
app.get('/update', function (req, res) {
  var data = req.query;
  var modSql = 'UPDATE ' + table + ' SET remainder = ?,time = ? WHERE name = ?';
  var modSqlParams = [data.remainder, new Date(), data.name];
  connection.query(modSql, modSqlParams, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      return;
    }
    console.log('UPDATE affectedRows', result.affectedRows);
    if (result.affectedRows) {
      res.send(result);
    } else {
      res.send('error');
    }
  });
})
/**
 * 展示接口
 * @param
 * @return
 */

app.get('/show', function (req, res) {
  const clientIp = requestIp.getClientIp(req);

  var sql = 'SELECT * FROM ' + table;

  connection.query(sql, async function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    const { getLog } = require('./utils/git');
    let _gitLog = await getLog()
    //console.log(result);
    var back = {
      list: result,
      msg: uuidv1(),
      clientIp: clientIp,
      commit: _gitLog
    };
    res.send(back);

  });
})
/**
 * 查询接口
 * @param
 * @return
 */

app.get('/search', function (req, res) {
  var data = req.query;
  var sql = 'SELECT * FROM ' + table + ' WHERE name= ? ';
  connection.query(sql, data.name, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    res.send(result);
  });
})
/**
 * 删除接口
 * @param
 * @return
 */
app.get('/delete', function (req, res) {
  var data = req.query;
  var delSql = 'DELETE FROM ' + table + ' where name = ? ';
  connection.query(delSql, data.name, function (err, result) {
    if (err) {
      console.log('[DELETE ERROR] - ', err.message);
      return;
    }
    console.log('DELETE affectedRows', result.affectedRows);
    if (result.affectedRows) {
      res.send(result);
    } else {
      res.send('error');
    }
  });
})
/**
 * 清库接口
 */
app.post('/truncate', function (req, res) {
  var sql = 'TRUNCATE TABLE ' + table;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[DELETE ERROR] - ', err.message);
      return err;
    }
    console.log('TRUNCATE TABLE result', result);
    res.send(result);
  });
});
app.listen(httpPort, () => {
  console.log('listening ', httpPort);
});