const restify = require('restify');
const BusBoy = require('busboy');
const server = restify.createServer();
fs = require('fs');

server.use(restify.plugins.bodyParser())

server.get('/data', (req, res, next) => {
    console.log('itworks')
    res.send(200, "yay")
    next()
})

server.post('/post', (req, res, next) => {
    let output, input, model;
    model = '/home/mpcr/Desktop/out'
    if (!fs.existsSync('/tmp/output')) {
        fs.mkdirSync('/tmp/output')
    }
    output = '/tmp' + '/output/' + Math.floor(Math.random() * 1000000000);
    fs.mkdirSync(output)
    input = req.files.image.path
    let dirName = Math.floor(Math.random() * 1000000000);
    let inputDir = '/tmp/' + dirName
    fs.mkdirSync('/tmp/' + dirName)
    dirName = dirName + '/' + req.files.image.name
    console.log(dirName)
    let oname = req.files.image.name.split('.png')[0]
    fs.renameSync(input, '/tmp/'+ dirName)
    let spawn = require('child_process').spawn;
    let argu = ['/home/mpcr/Desktop/web_service/simserve/pix2pix-tensorflow/pix2pix.py', '--mode test', '--output_dir', output, '--input_dir', inputDir, '--checkpoint', model]
    let process = spawn('python', argu);

    process.stdout.on('exit', function (data, data2) {
	console.log(data, data2)
        let html = fs.readFileSync(output + '/images/' + oname + '-outputs.png')
        res.send(200, html)
      });
    })
    


server.listen(8080, console.log('running'))

