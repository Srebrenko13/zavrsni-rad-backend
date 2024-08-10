import {AccountData} from "../models/AccountData";
import {DatabaseStatus} from "../models/DatabaseStatus";
import {Client, connect} from 'ts-postgres';
import {Utils} from "./utils";
import {compareSync, hashSync} from "bcrypt-ts";

async function usernameExists(username: string, client: Client): Promise<boolean>{
    const query = {text: "SELECT * FROM users WHERE username = $1;"};
    const result = await client.query(query, [username]);

    return result.rows.length !== 0;
}

async function emailExists(email: string, client: Client): Promise<boolean>{
    const query = {text: "SELECT * FROM users WHERE email = $1;"};
    const result = await client.query(query, [email]);

    return result.rows.length !== 0;
}

async function checkPassword(username: string, password: string, client: Client): Promise<boolean>{
    const query = {text: "SELECT password FROM users WHERE username = $1;"}
    const result = await client.query(query, [username]);
    if(result.rows.length === 1){
        const hash = result.rows[0][result.names.indexOf('password')];
        console.log("Loaded password hash from database: " + hash);
        const compare = compareSync(password, hash);
        console.log("Passwords match: " + compare);
        return compare;
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

    console.log("Account successfully created: " + (result.status === "INSERT 0 1"));
    return (result.status === "INSERT 0 1");
}

async function loadUserData(username: string): Promise<AccountData | DatabaseStatus>{
    const client = await connect(Utils.databaseInfo);
    const query =
        {text: "SELECT userid, username, email, userrole, datecreated, aboutme FROM users WHERE username = $1;"}
    const result = await client.query(query, [username]);
    if(result.rows.length !== 1) return {loadingFailed: true}
    const response: AccountData = {
        id: result.rows[0][result.names.indexOf('userid')],
        username: result.rows[0][result.names.indexOf('username')],
        email: result.rows[0][result.names.indexOf('email')],
        role: result.rows[0][result.names.indexOf('userrole')],
        loginStatus: true,
        dateCreated: new Date(result.rows[0][result.names.indexOf('datecreated')]),
        aboutMe: result.rows[0][result.names.indexOf('aboutme')]
    }
    console.log(response);

    return response;
}

export { registerCheck,createAccount, loadUserData, loginCheck};