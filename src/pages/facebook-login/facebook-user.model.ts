export class FacebookUserModel {
    image:string;
    gender:string;
    name:string;
    user_id:string;
    friends:Array<string> = [];
    photos:Array<string> = [];
}
