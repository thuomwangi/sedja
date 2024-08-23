const vision = require('@google-cloud/vision');
const conf = require('../service_account.json')
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const { Document, Packer, Paragraph } = require('docx');

const CREDENTIALS = JSON.parse(JSON.stringify(conf));

const config = {
    credentials:{
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    } 
}

const client = new vision.ImageAnnotatorClient(config);


const detectText = async (file_path, file_name)=>{

    let [result] = await client.textDetection(file_path);
    if (result.fullTextAnnotation.text){
        _topdf(file_name, result.fullTextAnnotation.text);
        _toWord(file_name, result.fullTextAnnotation.text)
    }
}

const _topdf = async (outputFilePath, text) => {
  
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage();
 
  const { width, height } = page.getSize();
  page.drawText(text, {
    x: 50,
    y: height - 100, // Adjust this to position the text correctly
    size: 12,
    color: rgb(0, 0, 0),
  });
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(`${outputFilePath}.pdf`, pdfBytes);
}


const _toWord = async (outputFilePath, text) => {

  const doc = new Document({
    creator: "sedja", 
    title: "Generated Document",
    description: "",
    sections: [ 
        {
          children: text.split('\n').map(line => new Paragraph(line)),
        },
      ],
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(`${outputFilePath}.docx`, buffer);
}

module.exports = detectText;