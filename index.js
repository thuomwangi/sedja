const express = require ("express");
const multer = require("multer");
const f_auth = require('./controllers/fileAuth');
const detectText = require("./controllers/gcloudOCR");

const app = express();

const upload = multer({ dest: 'uploads/' });


app.post('/upload', upload.single('file'),  f_auth, (req, res) => {

  const file_path = req.file?.path;
  const file_name = req.file?.originalname.split('.')[0]
  detectText(file_path, file_name);
  res.send('File uploaded successfully');
});

app.listen(3000, ()=>{
    console.log("App is listening to port 3000");
})