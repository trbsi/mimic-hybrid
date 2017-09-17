import { Injectable } from "@angular/core";
import { ApiSettings } from '../../components/api-settings/api-settings';

@Injectable()
export class SearchService {
    constructor(public apiSettings:ApiSettings) {
    }

    /**
     * get search result from server
     * param string Any search termen
     */
    search(term) {
        var data = {
            term: term,
        };
        return this.apiSettings.sendRequest(data, 'search', 'get');
    }

}
