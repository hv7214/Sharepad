const express = require('express');
const router = express.Router();

router.get('/pad/:name', (req, res) => {
      var name = req.path.substring(5);
      res.render('editor', {
        padname: name
      });
});

module.exports = router;
