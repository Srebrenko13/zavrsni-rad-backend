import {AccountData} from "../models/AccountData";
import {DatabaseStatus} from "../models/DatabaseStatus";
import {Client, connect} from 'ts-postgres';
import {Utils} from "./utils";
import {hashSync} from "bcrypt-ts";

async function usernameExists(username: string, client: Client): Promise<boolean>{
    const query = {text: "SELECT * FROM users WHERE username = $1"};
    const result = await client.query(query, [username]);

    return result.rows.length !== 0;
}

async function emailExists(email: string, client: Client): Promise<boolean>{
    const query = {text: "SELECT * FROM users WHERE email = $1"};
    const result = await client.query(query, [email]);

    return result.rows.length !== 0;
}

async function createAccount(username: string, email: string, password: string): Promise<boolean>{
    const hash = hashSync(password, 10);

    const client = await connect(Utils.databaseInfo);
    const query = {text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);"};
    const result = await client.query(query, [username, email, hash]);

    console.log("Account successfully created: " + (result.status === "INSERT 0 1"));
    return (result.status === "INSERT 0 1");
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

async function fillData(): Promise<AccountData> {
    return {
        id: 1,
        username: "Test",
        email: "test@test.com",
        loginStatus: true,
        role: "user"
    }
}

export {fillData, registerCheck,createAccount};