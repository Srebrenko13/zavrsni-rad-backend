import {AccountData} from "../models/AccountData";
import {fillData} from "./databaseFunctions";

async function handleLogin(username: string, password: string): Promise<AccountData> {

    return fillData();
}

async function handleRegister(username: string, email: string, password: string): Promise<AccountData>{

    return fillData();
}

export {handleLogin, handleRegister};