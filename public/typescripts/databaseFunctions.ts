import {AccountData} from "../models/AccountData";
import {DatabaseStatus} from "../models/DatabaseStatus";
import {Client, connect} from 'ts-postgres';
import {Utils} from "./utils";
import {compareSync, hashSync} from "bcrypt-ts";
import {StoryModel} from "../models/StoryModel";
import {GameInfo} from "../models/GameInfo";

async function usernameExists(username: string, client: Client): Promise<boolean>{
    const query = {text: "SELECT username FROM users WHERE username = $1;"};
    const result = await client.query(query, [username]);

    return result.rows.length !== 0;
}

async function emailExists(email: string, client: Client): Promise<boolean>{
    const query = {text: "SELECT email FROM users WHERE email = $1;"};
    const result = await client.query(query, [email]);

    return result.rows.length !== 0;
}

async function checkPassword(username: string, password: string, client: Client): Promise<boolean>{
    const query = {text: "SELECT password FROM users WHERE username = $1;"}
    const result = await client.query(query, [username]);
    if(result.rows.length === 1){
        const hash = result.rows[0][result.names.indexOf('password')];
        return compareSync(password, hash);
    } else return false;
}

async function loginCheck(username: string, password: string): Promise<DatabaseStatus>{
    const client = await connect(Utils.databaseInfo);
    let usernameCheck = await usernameExists(username, client);
    let passwordCheck: boolean;
    if(usernameCheck) passwordCheck = await checkPassword(username, password, client);
    else return{
        usernameExists: true
    };
    if(passwordCheck) return{
        usernameExists: false,
        passwordsMatch: true
    };
    else return{
        usernameExists: false,
        passwordsMatch: false
    }
}

async function registerCheck(username: string, email: string): Promise<DatabaseStatus>{
    const client = await connect(Utils.databaseInfo);
    let usernameCheck = await usernameExists(username, client);
    let emailCheck = await emailExists(email, client);

    return {
        usernameExists: usernameCheck,
        emailExists: emailCheck
    }
}

async function createAccount(username: string, email: string, password: string): Promise<boolean>{
    const hash = hashSync(password, 10);

    const client = await connect(Utils.databaseInfo);
    const query = {text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);"};
    const result = await client.query(query, [username, email, hash]);

    return (result.status === "INSERT 0 1");
}

async function loadUserData(username: string): Promise<AccountData | DatabaseStatus>{
    const client = await connect(Utils.databaseInfo);
    let response;
    const query =
        {text: "SELECT userid, username, email, datecreated, aboutme FROM users WHERE username = $1;"}
    try{
        const result = await client.query(query, [username]);
        if(result.rows.length !== 1) {
            return {loadingFailed: true}
        }
        response = {
            id: result.rows[0][result.names.indexOf('userid')],
            username: result.rows[0][result.names.indexOf('username')],
            email: result.rows[0][result.names.indexOf('email')],
            loginStatus: true,
            dateCreated: new Date(result.rows[0][result.names.indexOf('datecreated')]),
            aboutMe: result.rows[0][result.names.indexOf('aboutme')]
        }
    } catch(err){
        console.log(err);
    } finally{
        // await client.end();
    }
    if(response !== undefined) return response;
    else return {loadingFailed: true};
}

async function editAbout(username: string, about: string): Promise<boolean>{
    const client = await connect(Utils.databaseInfo);
    const query = {text: "UPDATE users SET aboutme = $1 WHERE username = $2"};
    const result = await client.query(query, [about, username]);
    return result.status === 'UPDATE 1';
}

async function deleteGame(client: Client, gameid: number){
    let query = {text: "DELETE FROM games WHERE gameid = $1"};
    const result = await client.query(query, [gameid]);
    console.log(result);
}

async function saveGame(userid: number, topic: string, chapters: [StoryModel]): Promise<boolean>{
    const client = await connect(Utils.databaseInfo);
    let query =
        {text: "INSERT INTO games (userid, topic, numberofchapters) VALUES ($1, $2, $3)"};
    let result = await
        client.query(query, [userid, topic, chapters.length]);

    if(result.status === 'INSERT 0 1'){
        query = {text: "SELECT gameid FROM games ORDER BY dateplayed DESC LIMIT 1;"};
        result = await client.query(query);
        const gameid = result.rows[0][result.names.indexOf('gameid')];

        query = {text: "INSERT INTO chapters (gameid, chapter_number, description, story," +
                "option_1, option_2, option_3, game_finished, chosen_option, picture) VALUES ($1, $2, $3," +
                "$4, $5, $6, $7, $8, $9, $10)"};
        for(let i = 0; i < chapters.length; i++){
            const chapter = chapters[i];
            result = await
                client.query(query, [gameid, chapter.chapter, chapter.description, chapter.story,
                chapter.option_1, chapter.option_2, chapter.option_3, chapter.game_finished, chapter.chosen_option, chapter.picture]);
            if(result.status !== "INSERT 0 1"){
                await deleteGame(client, gameid);
                return false;
            }
        }
    } else return false;
    return true;
}

async function loadGames(userid: number): Promise<GameInfo[]> {
    const client = await connect(Utils.databaseInfo);
    let query =
        {text: "SELECT gameid, topic, numberofchapters FROM games WHERE userid = $1 ORDER BY dateplayed DESC;"};
    const result = await client.query(query, [userid]);
    let response: GameInfo[] = [];
    for(let i = 0; i < result.rows.length; i++){
        const row: GameInfo = {
            game_id: result.rows[i][result.names.indexOf("gameid")],
            topic: result.rows[i][result.names.indexOf("topic")],
            number_of_chapters: result.rows[i][result.names.indexOf("numberofchapters")]
        };
        response.push(row);
    }
    return response;
}

async function loadChapter(game_id: number, chapter: number): Promise<StoryModel>{
    const client = await connect(Utils.databaseInfo);
    let query = {text: "SELECT * FROM chapters WHERE gameid = $1 AND chapter_number = $2"};
    let result: any;

    try{
        result = await client.query(query, [game_id, chapter]);
    } catch(err){
        console.log("Error loading chapter", err);
    } finally {
        // await client.end();
    }

    return{
        chapter: result.rows[0][result.names.indexOf('chapter_number')],
        description: result.rows[0][result.names.indexOf('description')],
        story: result.rows[0][result.names.indexOf('story')],
        picture: result.rows[0][result.names.indexOf('picture')],
        option_1: result.rows[0][result.names.indexOf('option_1')],
        option_2: result.rows[0][result.names.indexOf('option_2')],
        option_3: result.rows[0][result.names.indexOf('option_3')],
        game_finished: result.rows[0][result.names.indexOf('game_finished')],
        chosen_option: result.rows[0][result.names.indexOf('chosen_option')]
    }
}

export {registerCheck,createAccount, loadUserData, loginCheck, editAbout, saveGame, loadGames, loadChapter};