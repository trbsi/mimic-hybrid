import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { ApiSettings } from '../../components/api-settings/api-settings';

@Injectable()
export class PostLoginService {

    constructor(public apiSettings: ApiSettings) 
    {
    }


    /**
     * Set username
     * @param object data Facebook or twitter data
     */
    setUsername(data)
    {
        var postData = {};
        postData['username'] = data.username;
        return this.apiSettings.post(postData, 'set-username'); 
    }
}
