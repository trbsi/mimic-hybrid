import { Component } from '@angular/core';
import { MenuController, NavParams, NavController } from 'ionic-angular';
import { UserModel } from '../profile/profile.model';
import { ProfilePage } from '../profile/profile';

@Component({
    selector: 'followers-page',
    templateUrl: 'followers.html'
})
export class FollowersPage {
    users = [];
    type:string; //followers or following

    constructor(public menu:MenuController, public navParams:NavParams, public nav:NavController) {
        this.users = navParams.get('users');
        console.log(this.users);
        this.type = navParams.get('type');
    }

    ionViewDidEnter() {
        // the root left menu should be disabled on this page
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    }

    /**
     * Open user profile
     * @param int id User id
     */
    openUserProfile(id) {
        this.nav.push(ProfilePage, {
            user_id: id
        });
    }
}
