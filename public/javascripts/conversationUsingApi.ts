import {OpenAI} from "openai";
import {ChatCompletionMessageParam} from "openai/resources/chat";
import * as readline from 'readline';
import * as dotenv from 'dotenv';

// create connection with OpenAI api using API key
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.API_KEYv2,
    organization: 'org-Fdvt1n7pv7J51vOnEs2TzDIf',
    }
);

// create message array to store messages in current conversation with our bot
const messages: ChatCompletionMessageParam[] = [];

// initialize readline interface
const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// set prompt for user
userInterface.setPrompt(`[server]:Send a message:`);
userInterface.prompt();

// handle user input, process it and return the answer
userInterface.on('line', async (input) => {
    // create request message and add it to messages array
    const requestMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: input
    }
    messages.push(requestMessage);

    // call OpenAI API to generate response
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages
    });

    // display response to the user
    const responseMessage = completion.choices[0].message;
    if(responseMessage){
        console.log('[bot]:' + String(responseMessage.content));
        messages.push({
            role: responseMessage.role,
            content: responseMessage.content
        })
    }

    // prompt user for next message
    userInterface.prompt();
});

// handle program exit
userInterface.on('close', () => {
    console.log('[server]:Thank you for using our bot!');
});