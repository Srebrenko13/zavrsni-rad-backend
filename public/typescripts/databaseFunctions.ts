import {AccountData} from "../models/AccountData";

async function fillData(): Promise<AccountData> {
    return {
        id: 1,
        username: "Test",
        email: "test@test.com",
        loginStatus: true,
        role: "user",
        history: "empty history"
    }
}

export {fillData};