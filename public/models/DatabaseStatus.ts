export interface DatabaseStatus{
    usernameExists?: boolean,
    emailExists?: boolean,
    otherError?: boolean,
    errorStatus?: number,
    loadingFailed?: boolean,
    passwordsMatch?: boolean
}