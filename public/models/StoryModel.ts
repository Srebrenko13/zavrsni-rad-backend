import OpenAI from "openai";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export interface StoryModel{
    chapter: number;
    description: string;
    story: string;
    picture?: string;
    option_1?: string;
    option_2?: string;
    option_3?: string;
    game_finished: boolean;
    history?: ChatCompletionMessageParam[];
}