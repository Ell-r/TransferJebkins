export interface UserTokenInfo {
    email: string;
    name: string;
    image: string;
    roles: string[] | undefined;
    exp: number;
}