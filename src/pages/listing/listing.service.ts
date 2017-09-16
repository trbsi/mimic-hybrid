import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { ApiSettings } from '../../components/api-settings/api-settings';
import { ListingModel } from './listing.model';

@Injectable()
export class ListingService {
    constructor(public http:Http, public apiSettings:ApiSettings) {
    }

    /**
     * Get all mimics
     */
    getAllMimics()
    {
        var data = {};
        data['page'] = 0;
        return this.apiSettings.sendRequest(data, 'mimic/list', 'get');  
    }

    /**
     * Upvote mimic
     * @param int id Id of a mimic
     * @param string type "original" or "response"
     */
    upvote(id, type)
    {
        var data = {};
        switch (type) {
            case "original":
                data['original_mimic_id'] = id;
                break;
            case "response":
                data['response_mimic_id'] = id;
                break;
        }

        return this.apiSettings.sendRequest(data, 'mimic/upvote', 'post');  
    }
}
