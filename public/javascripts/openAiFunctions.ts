import {OpenAI} from "openai";
import {ChatCompletionMessageParam} from "openai/resources/chat";
import * as readline from 'readline';
import * as dotenv from 'dotenv';
import {Utils} from "./utils";

dotenv.config();
const utils = new Utils();
const openai = new OpenAI({
        apiKey: process.env.API_KEYv2,
        organization: 'org-Fdvt1n7pv7J51vOnEs2TzDIf',
    }
);

// create message array to store history in current conversation with our bot
const history: ChatCompletionMessageParam[] = [];

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// configure bot about what we want from him and how to return/output the response in this case JSON file with
// specific fields, like story, description, choices, depth etc.
const systemMessage : ChatCompletionMessageParam = {
    role: 'system',
    content: utils.systemSetup(),
};

history.push(systemMessage);

// set starting prompt for the story theme
userInterface.setPrompt("[bot]: Please give us a topic or short description of desired story:");
userInterface.prompt();

const startMessage : ChatCompletionMessageParam = {
    role: 'user',
    content: userInterface.line,
};

// set prompt for user
userInterface.setPrompt(`[bot]:Please choose one of the paths!`);
userInterface.prompt();

// handle user input, process it and return the answer
userInterface.on('line', async (input) => {
    // create request message and add it to history array
    const requestMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: input
    }
    history.push(requestMessage);

    // call OpenAI API to generate response
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        response_format: {"type" : "json_object"},
        messages: history
    });

    // display response to the user
    const responseMessage = completion.choices[0].message;
    if(responseMessage){
        console.log('[bot]:' + String(responseMessage.content));
        history.push({
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