import {AccountData} from "../models/AccountData";
import {createAccount, loadUserData, loginCheck, registerCheck} from "./databaseFunctions";
import {RegisterInfo} from "../models/RegisterInfo";
import {LoginInfo} from "../models/LoginInfo";
import {DatabaseStatus} from "../models/DatabaseStatus";

async function handleLogin(data: LoginInfo): Promise<AccountData | DatabaseStatus> {
    const check = await loginCheck(data.user, data.password);
    if(check.passwordsMatch && !check.usernameExists) return loadUserData(data.user);
    else return check;
}

async function handleRegister(data: RegisterInfo): Promise<AccountData | DatabaseStatus>{
    const exists = await registerCheck(data.user, data.email);
    let creationStatus: boolean;
    if(!exists.emailExists && !exists.usernameExists) creationStatus = await createAccount(data.user, data.email, data.password);
    else return {
        usernameExists: exists.usernameExists,
        emailExists: exists.emailExists
    };

    if(!creationStatus) return{
        otherError: true,
        errorStatus: 3
    };
    else return loadUserData(data.user);
}

export {handleLogin, handleRegister};