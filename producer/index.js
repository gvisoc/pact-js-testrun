var express = require('express')
var app = express()
var port = process.argv[2] // OMG do not kill me please
// Random body weridly written
const EXPECTED_BODY = [{dog: 345},
  {
    dog: 374834
  },
  {dog:0},
  {dog:34},
  {dog: 3},
  {dog:
    84},
  {dog:5},
  {dog:64
  }
]

app.get('/dogs', function (req, res) {
  res.send(EXPECTED_BODY)
})

app.listen(port, () => console.log('Example app listening on port ' + port + '!'))
