const http = require('http');
const path = require('path');
const fs = require('fs');


const PORT = process.env.PORT || 5000;

const server = http
    .createServer((req, res) => {

        //Build file path
        let filePath = path.join(
            __dirname,
            '..',
            'public',
            req.url === '/' ? 'index.html' : req.url
        );

        //Create contentType with default value
        let contentType = 'text/html';

        //Gets file extension
        let fileExtension = path.extname(filePath);

        switch(fileExtension){
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case 'png': 
                contentType = 'image/png';
                break;
            case 'jpg':
                contentType = 'image/jpg';
                break;
            case 'json':
                contentType = 'application/json';
                break;
        }

        fs.readFile(filePath, (err, content) => {
            if(err){
                if(err.code === 'ENOENT'){
                    //Page not found
                    fs.readFile(path.join(__dirname, '..', 'public', '404.html'), (err, content) => {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(content, 'utf8');
                    })
                }else{
                    //Another error
                    res.writeHead(500);
                    res.end(`Server error ${err.code}`);
                }
            }else{
                //Everything okay
                res.writeHead(200, contentType);
                res.end(content, 'utf8');
            }
            
        });
    });

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));