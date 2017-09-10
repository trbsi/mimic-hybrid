import { Injectable } from "@angular/core";

import 'rxjs/add/operator/toPromise';
import { ApiSettings } from '../../components/api-settings/api-settings';

@Injectable()
export class LoginService {

    constructor(public apiSettings:ApiSettings) {
    }


    /**
     * Login on server and get back response
     * @param object data Facebook or twitter data
     * @param string provider "faebook" or "twitter"
     */
    loginOnServer(data, provider) {
        var postData = {};
        postData['provider'] = provider;
        postData['provider_data'] = data;
        return this.apiSettings.post(postData, 'auth/login');
    }
}
