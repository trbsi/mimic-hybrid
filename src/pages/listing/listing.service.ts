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
     * @param int page Current page for original mimics
     */
    getAllMimics(page)
    {
        var data = {};
        if(page != null) {
            data['page'] = page;
        }
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

    /**
     * Load more mimic responses
     * @param int page Current page for response mimics
     * @param int original_mimic_id Id of a current original mimic you are looking at
     */
    loadMoreResponses(page, original_mimic_id) 
    { 
        var data = {};
        data['page'] = page;
        data['original_mimic_id'] = original_mimic_id;
        console.log(data);
        return this.apiSettings.sendRequest(data, 'mimic/load-responses', 'get');  
    }
}
