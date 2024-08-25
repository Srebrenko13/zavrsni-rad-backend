import {OpenAI} from "openai";
import {ChatCompletionMessageParam} from "openai/resources/chat";
import * as dotenv from 'dotenv';
import {Utils} from "./utils";
import {StoryModel} from "../models/StoryModel";

dotenv.config();
const openai = new OpenAI({
        apiKey: process.env.API_KEYv2,
        organization: process.env.ORG,
    }
);

/* configure bot about what we want from him and how to return/output the response in this case JSON file with
   specific fields, like story, description, choices, depth etc. */
async function setupSystemSettings(topic: string, chapters: number): Promise<StoryModel>{
    // generate prompt and save it to chat history
    const history: ChatCompletionMessageParam[] = [];
    const systemMessage : ChatCompletionMessageParam = {
        role: 'system',
        content: Utils.systemSetup(),
    };
    history.push(systemMessage);

    const topicMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: "{topic: " + topic + ", chapters: " + chapters + "}",
    }

    history.push(topicMessage);

    // call api for response
    const answer = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: {"type" : "json_object"},
        messages: history,
        temperature: 1.3
    });

    // save response to chat history
    if(answer){
        history.push({
            role: answer.choices[0].message.role,
            content: answer.choices[0].message.content
        })
    }
    return parseResponse(answer, history);
}

async function sendPrompt(message: string , gameEnding: boolean, history: ChatCompletionMessageParam[]) : Promise<StoryModel>{
    // generate topic message and save it to message history
    const prompt: ChatCompletionMessageParam = {
        role: 'user',
        content: message
    }
    history.push(prompt);

    // check if game is ending, remind AI that it has to finish the game
    if(gameEnding){
        const endPrompt: ChatCompletionMessageParam = {
            role: 'system',
            content: Utils.endGamePrompt
        }
        history.push(endPrompt);
    }

    // call api for response
    const story = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: {"type" : "json_object"},
        messages: history,
        temperature: 1.3
    });

    // save response to chat history
    if(story){
        history.push({
            role: story.choices[0].message.role,
            content: story.choices[0].message.content
        })
    }
    return parseResponse(story, history);
}

async function getPictureFromApi(description: string) : Promise<string> {
    const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: description,
        size: "256x256",
        quality: "standard",
        n: 1
    })
    if(response){
        return String(response.data[0].url);
    }
    else return "Failed to get url to the image!";
}

async function printNode(input: OpenAI.Chat.Completions.ChatCompletion) : Promise<boolean>{
    const json = JSON.parse(<string>input.choices[0].message.content);
    console.log("Chapter " + json.chapter);
    console.log(json.story);
    console.log(json.gameEnded);
    if(json.gameEnded == false){
        // uncomment for DALL-E image generation API calls
        // console.log(await getPictureFromApi(openai, json.description));
        console.log("OPTIONS:");
        console.log("1: " + json.firstOpt);
        console.log("2: " + json.secondOpt);
        console.log("3: " + json.thirdOpt);
        return false;
    }
    else return true;
}

async function parseResponse(input: OpenAI.Chat.Completions.ChatCompletion, history: ChatCompletionMessageParam[]): Promise<StoryModel>{
    const json = JSON.parse(<string>input.choices[0].message.content);
    // const image = await getPictureFromApi(json.description);
    return {
        chapter: parseInt(json.chapter),
        description: json.description,
        story: json.story,
        picture: "testimage.jpg",
        option_1: json.firstOpt,
        option_2: json.secondOpt,
        option_3: json.thirdOpt,
        game_finished: json.gameEnded,
        history: history,
    };
}

export {sendPrompt, setupSystemSettings, getPictureFromApi};