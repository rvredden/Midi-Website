import express  from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import MidiWriter from 'midi-writer-js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
const app = express();
const port = 3000;
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

//Parse Text
function parseText(inputText) {
    const codeBlockRegex = /```javascript([\s\S]*?)```/g;
    let match;
    const codeBlocks = [];

    while ((match = codeBlockRegex.exec(inputText)) !== null) {
    codeBlocks.push(match[1].trim());
    }

    console.log('Extracted JavaScript code blocks:', codeBlocks);

    const __dirname = dirname(fileURLToPath(import.meta.url));

    codeBlocks.forEach((code, index) => {
    const filePath = path.join(__dirname, `extractedCode_${index + 1}.js`);
    fs.writeFile(filePath, code, (err) => {
        if (err) {
        return console.error(`Error writing file ${filePath}:`, err);
        }
        console.log(`File ${filePath} has been saved.`);
    });
    });
}

// Get data from ChatGPT
const openai = new OpenAI({ apiKey: process.env.API_KEY});

async function dataSend(data) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: data }],
    model: "gpt-3.5-turbo"
  });

  parseText(completion.choices[0].message.content) 
  console.log(completion.choices[0].message.content)
}


// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Serve static files from the current directory
app.use(express.static('.'));


// Endpoint to generate MIDI
app.post('/generate_midi', (req, res) => {
    const notes = req.body.notes.split(' '); // Assuming space-separated notes
    dataSend(req.body.notes)
    let track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.NoteEvent({ pitch: notes, duration: '1' }));
    let write = new MidiWriter.Writer(track);
    let midiFile = write.buildFile();

    // Generate a random file name
    let fileName = `midi_${Date.now()}.mid`;
    fs.writeFileSync(fileName, midiFile, 'binary');
    
    res.json({ fileUrl: `http://localhost:${port}/${fileName}` });

});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});