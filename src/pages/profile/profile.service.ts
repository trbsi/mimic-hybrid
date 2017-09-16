import { Injectable } from "@angular/core";
import { ApiSettings } from '../../components/api-settings/api-settings';

@Injectable()
export class ProfileService {
    constructor(public apiSettings:ApiSettings) 
    {
    }

    /**
     * Get user profile
     */
    getProfile() 
    {
        var data = {};
        return this.apiSettings.sendRequest(data, 'profile/user', 'get');  
    }
}
