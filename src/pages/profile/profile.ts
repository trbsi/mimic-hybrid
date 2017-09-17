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

    constructor(public menu:MenuController,
                public app:App,
                public navParams:NavParams,
                public profileService:ProfileService) 
    {
        this.display = "original";
        console.log(this.navParams.get('user_id'));
    }

    ionViewDidLoad() {
        this.profileService.getProfile({})
        .then(data => {
            this.profile = data.user;
            //get user's original mimics
            this.profileService.getUserMimics({})
            .then(data => {
                this.mimics = data.mimics;
                console.log(data);
            });
        });
    }

    goToFollowersList() {
        // close the menu when clicking a link from the menu
        this.menu.close();
        this.app.getRootNav().push(FollowersPage, {
            list: [],
            type: 'followers'
        });
    }

    goToFollowingList() {
        // close the menu when clicking a link from the menu
        this.menu.close();
        this.app.getRootNav().push(FollowersPage, {
            list: [],
            type: 'following'
        });
    }

    onSegmentChanged(segmentButton:SegmentButton) { 
        switch (segmentButton.value) {
            case "original":
                // code...
                break;
            case "response":
                // code...
                break;
        }
    } 
 
    onSegmentSelected(segmentButton:SegmentButton) { 
        // console.log('Segment selected', segmentButton.value); 
        /*this.menu.close(); 
        this.app.getRootNav().push(SettingsPage);*/ 
    } 

    goToSettings() {
        // close the menu when clicking a link from the menu
        /*this.menu.close();
        this.app.getRootNav().push(SettingsPage);*/
    }

    deleteMimics() {
        this.app.getRootNav().push(DeleteMimics);
    }
}
