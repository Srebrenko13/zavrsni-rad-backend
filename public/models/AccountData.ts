export interface AccountData{
    id: number;
    username: string;
    email: string;
    loginStatus: boolean;
    role: string;
    dateCreated: Date;
    aboutMe?: string;
}