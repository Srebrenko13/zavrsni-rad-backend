export interface AccountData{
    id: number;
    username: string;
    email: string;
    loginStatus: boolean;
    dateCreated: Date;
    aboutMe?: string;
}