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

    /**
     * Follow or unfollow user
     */
    follow(data) {
        return this.apiSettings.sendRequest(data, 'profile/follow', 'post');
    }


    /**
     * Get all followers (users who are following this user)
     */
    followers(data) {
        return this.apiSettings.sendRequest(data, 'profile/followers', 'get');
    }

    /**
     * Get all following (users that this user is following)
     */
    following(data) {
        return this.apiSettings.sendRequest(data, 'profile/following', 'get');
    }

    /**
     * Block user
     */
    blockUser(data) {
        return this.apiSettings.sendRequest(data, 'profile/block', 'post');
    }
}
