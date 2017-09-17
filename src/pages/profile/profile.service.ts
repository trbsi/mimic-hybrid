import { Injectable } from "@angular/core";
import { ApiSettings } from '../../components/api-settings/api-settings';

@Injectable()
export class ProfileService {
    constructor(public apiSettings:ApiSettings) {
    }

    /**
     * Get user profile
     */
    getProfile(data) {
        return this.apiSettings.sendRequest(data, 'profile/user', 'get');
    }

    /**
     * Get user's mimics
     */
    getUserMimics(data) {
        return this.apiSettings.sendRequest(data, 'mimic/user-mimics', 'get');
    }

    /**
     * Get user's mimics
     */
    deleteMimic(data) {
        return this.apiSettings.sendRequest(data, 'mimic/delete', 'delete');
    }
}
