var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cluster', pid:process.pid });
});

router.get('/pid', function(req, res, next){
	res.json({title:'Cluster', pid:process.pid});
});

module.exports = router;
