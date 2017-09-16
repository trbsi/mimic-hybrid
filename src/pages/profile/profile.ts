import { Component } from '@angular/core';
import { MenuController, App, NavParams } from 'ionic-angular';
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

    constructor(public menu:MenuController,
                public app:App,
                public navParams:NavParams,
                public profileService:ProfileService) 
    {
        this.display = "grid";
        console.log(this.navParams.get('user_id'));
    }

    ionViewDidLoad() {
        this.profileService.getProfile()
            .then(data => {
                console.log(data);
            });
    }

    goToFollowersList() {
        // close the menu when clicking a link from the menu
        this.menu.close();
        this.app.getRootNav().push(FollowersPage, {
            list: []
        });
    }

    goToFollowingList() {
        // close the menu when clicking a link from the menu
        this.menu.close();
        this.app.getRootNav().push(FollowersPage, {
            list: []
        });
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
