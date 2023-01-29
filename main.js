const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app  = express();
const PORT = process.env.PORT || 5000

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

app.post('/api/openai', async(req, res) => {
    const {prompt, size} = req.body;
    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';
    try{
        const response = await openai.createImage({ 
            prompt: prompt,
            n: 2,
            size: imageSize,
        });
        
        image_url = response.data.data[0].url;
        
        return res.status(200).json({
            succes: true,
            image_url
        })
    }catch(error){
        console.log(error)
        return res.status(200).json({
            succes: false,
            error: error.message
        })
    }
})

app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))