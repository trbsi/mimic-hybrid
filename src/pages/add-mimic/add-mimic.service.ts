import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { ApiSettings } from '../../components/api-settings/api-settings';

@Injectable()
export class AddMimicService {
    constructor(public apiSettings:ApiSettings) {
    }

    /**
     * Post image or video to server
     * @param object data Object containing different data
     */
    addMimic(data) {
        return this.apiSettings.sendRequest(data, 'mimic/add', 'upload', false);
    }

    /**
     * Upload video thumb
     * @param object data Object containing different data
     */
    uploadVideoThumb(data) {
        return this.apiSettings.sendRequest(data, 'mimic/upload-video-thumb', 'upload', false);
    }

}
