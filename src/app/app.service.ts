import { Injectable } from "@angular/core";

import 'rxjs/add/operator/toPromise';
import { ApiSettings } from '../../components/api-settings/api-settings';

@Injectable()
export class AppService {

    constructor(public apiSettings:ApiSettings) {
    }


    /**
     * Save push data
     */
    savePushToken(data) {
        return this.apiSettings.sendRequest(postData, 'save-push-token', 'post');
    }
}
 