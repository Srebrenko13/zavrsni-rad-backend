import {AccountData} from "../models/AccountData";
import {createAccount, fillData, registerCheck} from "./databaseFunctions";
import {RegisterInfo} from "../models/RegisterInfo";
import {LoginInfo} from "../models/LoginInfo";

async function handleLogin(data: LoginInfo): Promise<AccountData> {

    return fillData();
}

async function handleRegister(data: RegisterInfo): Promise<AccountData>{
    const exists = await registerCheck(data.user, data.email);
    if(!exists.emailExists && !exists.usernameExists) await createAccount(data.user, data.email, data.password);

    return fillData();
}

export {handleLogin, handleRegister};