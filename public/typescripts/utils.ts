import {AccountData} from "../models/AccountData";
import {DatabaseStatus} from "../models/DatabaseStatus";

export class Utils{
    static systemSetup(){
        return `I would like you to create nonlinear storytelling game with 5 chapters story based 
on a given theme or short description. The story MUST end at the 5 chapter or before if player picks
 option that ends the story. I need you to generate answer as JSON object with next fields: 
"story" (the story itself, it should be around one paragraph long), "description" (one sentence
 description of story),"chapter" (tells us the number of current chapter),  "firstOpt", "secondOpt", 
 "thirdOpt" (three possible choices for next chapter of the game) and "gameEnded" (boolean which marks if 
 story is done, should be true when 5th chapter is reached). Also please format JSON in proper way so I 
 can parse it later in my code. Some choices can lead to early ending of the game.`
    }

    static databaseInfo = {
        "user": "postgres",
        "password": "password",
        "database": "zavrsni"
    }

    static isAccountData(obj: any): obj is AccountData{
        return (obj as AccountData).id !== undefined;
    }
    static isDatabaseStatus(obj: any): obj is DatabaseStatus{
    return (obj as DatabaseStatus).emailExists !== undefined ||
        (obj as DatabaseStatus).otherError !== undefined;
    }
}