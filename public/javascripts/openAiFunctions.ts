import {OpenAI} from "openai";
import {ChatCompletionMessageParam} from "openai/resources/chat";
import * as readline from 'readline';
import * as dotenv from 'dotenv';
import {Utils} from "./utils";

dotenv.config();
const openai = new OpenAI({
        apiKey: process.env.API_KEYv2,
        organization: process.env.ORG,
    }
);
const topic = "futuristic city on another planet";

// create message array to store history in current conversation with our bot
const history: ChatCompletionMessageParam[] = [];

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/* configure bot about what we want from him and how to return/output the response in this case JSON file with
   specific fields, like story, description, choices, depth etc. */
async function setupSystemSettings(ai: OpenAI, messages: ChatCompletionMessageParam[]){
    // generate prompt and save it to chat history
    const systemMessage : ChatCompletionMessageParam = {
        role: 'system',
        content: Utils.systemSetup(),
    };
    messages.push(systemMessage);

    // call api for response
    const answer = await ai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        response_format: {"type" : "json_object"},
        messages: history
    });

    // save response to chat history
    if(answer){
        messages.push({
            role: answer.choices[0].message.role,
            content: answer.choices[0].message.content
        })
    }
}

async function sendPrompt(ai: OpenAI, message: string, messages: ChatCompletionMessageParam[]) : Promise<boolean>{
    // generate topic message and save it to message history
    const prompt: ChatCompletionMessageParam = {
        role: 'user',
        content: message
    }
    messages.push(prompt);

    // call api for response
    const story = await ai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        response_format: {"type" : "json_object"},
        messages: messages
    });

    // save response to chat history
    if(story){
        messages.push({
            role: story.choices[0].message.role,
            content: story.choices[0].message.content
        })
    }
    return printNode(story);
}

 async function start(){
    await setupSystemSettings(openai, history);
    await sendPrompt(openai, topic, history);

    // set up user prompt and push it
    userInterface.setPrompt(`[bot]: Please choose one of the paths! `);
    userInterface.prompt();
}

function printNode(input: OpenAI.Chat.Completions.ChatCompletion) : boolean{
    const json = JSON.parse(<string>input.choices[0].message.content);
    console.log("Chapter " + json.chapter);
    console.log(json.story);
    console.log(json.gameEnded);
    if(json.gameEnded == false){
        console.log("OPTIONS:");
        console.log("1: " + json.firstOpt);
        console.log("2: " + json.secondOpt);
        console.log("3: " + json.thirdOpt);
        return false;
    }
    else return true;
}

// handle user input, process it and return the answer
userInterface.on('line', async (input) => {
    // create request message and add it to history array
    const status = await sendPrompt(openai, input, history);
    // prompt user for next answer
    if(!status) userInterface.prompt();
    else userInterface.close();
});

// handle program exit
userInterface.on('close', () => {
    console.log('[bot]: Thank you for playing with us!');
});

// setup system settings and generate start of the story with options and first prompt
start();