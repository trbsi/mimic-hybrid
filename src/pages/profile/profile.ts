import { Component } from '@angular/core';
import { MenuController, App, NavParams, SegmentButton } from 'ionic-angular';
import { FollowersPage } from '../followers/followers';
//import { SettingsPage } from '../settings/settings';
import { DeleteMimics } from '../delete-mimics/delete-mimics';
import { ProfileService } from './profile.service';

import 'rxjs/Rx';

@Component({
    selector: 'profile-page',
    templateUrl: 'profile.html'
})
export class ProfilePage {
    display:string;
    profile:any;
    mimics = [];
    responses = [];
    userId = null;

    constructor(public menu:MenuController,
                public app:App,
                public navParams:NavParams,
                public profileService:ProfileService) 
    {
        this.display = "original";
        if(this.navParams.get('user_id')) {
            this.userId = this.navParams.get('user_id');
        }
    }

    ionViewDidLoad() {
        var data = {};
        if(this.userId != null) {
            data['id'] = this.userId;
        }

        this.profileService.getProfile(data)
        .then(data => {
            this.profile = data.user;
            //get user's original mimics
            this.getUserMimics(false);
        });
    }

    goToFollowersList() {
        // close the menu when clicking a link from the menu
        this.menu.close();
        this.app.getRootNav().push(FollowersPage, {
            type: 'followers'
        });
    }

    goToFollowingList() {
        // close the menu when clicking a link from the menu
        this.menu.close();
        this.app.getRootNav().push(FollowersPage, {
            type: 'following'
        });
    }

    onSegmentChanged(segmentButton:SegmentButton) { 
        switch (segmentButton.value) {
            case "original":
                if(this.mimics.length == 0) {
                    this.getUserMimics(false);
                }
                break;
            case "response":
                if(this.responses.length == 0) {
                    this.getUserMimics(true);
                }
                break;
        }
    } 
 
    onSegmentSelected(segmentButton:SegmentButton) { 
        // console.log('Segment selected', segmentButton.value); 
        /*this.menu.close(); 
        this.app.getRootNav().push(SettingsPage);*/
    }

    /*goToSettings() {
        // close the menu when clicking a link from the menu
        this.menu.close();
        this.app.getRootNav().push(SettingsPage);
    }*/

    /**
     * Get user's mimics or user's responses
     */
    private getUserMimics(responses) {
        var data = {};
        if(responses == true) {
            data['get_responses'] = true;
        }

        if(this.userId != null) {
            data['user_id'] = this.userId;
        }

        //get user's original mimics
        this.profileService.getUserMimics(data)
        .then(data => {
            if(responses == true) {
                this.responses = data.mimics;
            } else {
                this.mimics = data.mimics;
            }
        });
    }
}
