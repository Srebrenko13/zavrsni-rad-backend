import {AccountData} from "../models/AccountData";
import * as dotenv from "dotenv";

dotenv.config();

export class Utils{
    static systemSetup(){
        return `I would like you to create nonlinear storytelling game story based on a given theme or short description
 and required number of chapters . The story MUST end at the given chapter or before if player picks
 option that ends the story. I need you to generate answer as JSON object with next fields: 
"story" (the story itself, it should be around one paragraph long), "description" (one sentence
 description of story),"chapter" (tells us the number of current chapter),  "firstOpt", "secondOpt", 
 "thirdOpt" (three possible choices for next chapter of the game) and "gameEnded" (boolean which marks if 
 story is done, must be true when given chapter is reached). Also please format JSON in proper way so I 
 can parse it later in my code. Some choices can lead to early ending of the game.`
    }

    static replaySetup() {
        return 'I am currently replaying a nonlinear storytelling game with specified amount of chapters and some amount' +
            'of previous chapters. I will pass you previous chapters with their respective chosen option. I would like ' +
            'you to generate next chapter for the game. I need you to generate answer as JSON object with next fields: ' +
            '"story" (the story itself, it should be around one paragraph long), "description" (one sentence' +
            'description of story),"chapter" (tells us the number of current chapter),  "firstOpt", "secondOpt", ' +
            '"thirdOpt" (three possible choices for next chapter of the game) and "gameEnded" (boolean which marks if ' +
            'story is done, must be true when given chapter is reached). Also please format JSON in proper way so I ' +
            'can parse it later in my code. Some choices can lead to early ending of the game.' +
            'The story MUST end at the given chapter or before if player picks option that ends the story.'
    }

    static endGamePrompt = "This is the final chapter of the game, you have to end the story here." +
        "Do not generate any options for the player. Make sure the story is done.";

    static databaseInfo = {
        "user": "postgres",
        "password": process.env.DATABASE_PASSWORD,
        "database": "zavrsni"
    }

    static isAccountData(obj: any): obj is AccountData{
        return (obj as AccountData).id !== undefined;
    }
}