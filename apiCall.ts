import {OpenAI} from 'openai';
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
    apiKey: String(process.env.API_KEYv2),
    organization: 'org-Fdvt1n7pv7J51vOnEs2TzDIf',

});

async function main() {
    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Say this is a test" }],
        stream: true,
    });
    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
}

main();
