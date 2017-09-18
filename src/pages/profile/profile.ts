import { Component } from '@angular/core';
import { NavController, MenuController, App, NavParams, SegmentButton, ActionSheetController } from 'ionic-angular';
import { FollowersPage } from '../followers/followers';
import { ListingPage } from '../listing/listing';
//import { SettingsPage } from '../settings/settings';
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
    userId = null; //id if a user whose profile you are viewing

    constructor(public nav:NavController,
                public menu:MenuController,
                public app:App,
                public navParams:NavParams,
                public profileService:ProfileService,
                public actionSheetCtrl:ActionSheetController) {
        this.display = "original";
        if (this.navParams.get('user_id')) {
            this.userId = this.navParams.get('user_id');
        }
    }

    ionViewDidLoad() {
        var data = {};
        if (this.userId != null) {
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
        var data = {};
        if(this.userId) {
            data['user_id'] = this.userId;
        }

        this.profileService.followers(data)
        .then(data => {
            // close the menu when clicking a link from the menu
            this.menu.close();
            this.app.getRootNav().push(FollowersPage, {
                users: data.followers,
                type: 'followers'
            });
        });
    }

    goToFollowingList() {
        var data = {};
        if(this.userId) {
            data['user_id'] = this.userId;
        }
        
        this.profileService.following(data)
        .then(data => {
            // close the menu when clicking a link from the menu
            this.menu.close();
            this.app.getRootNav().push(FollowersPage, {
                users: data.following,
                type: 'following'
            });
        });
    }

    onSegmentChanged(segmentButton:SegmentButton) {
        switch (segmentButton.value) {
            case "original":
                if (this.mimics.length == 0) {
                    this.getUserMimics(false);
                }
                break;
            case "response":
                if (this.responses.length == 0) {
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
        if (responses == true) {
            data['get_responses'] = true;
        }

        if (this.userId != null) {
            data['user_id'] = this.userId;
        }

        //get user's original mimics
        this.profileService.getUserMimics(data)
            .then(data => {
                if (responses == true) {
                    this.responses = data.mimics;
                } else {
                    this.mimics = data.mimics;
                }
            });
    }


    /**
     * Do some action when user clicks on mimi on someone's or his profile
     * @param any type Mimic type: "response" or "original"
     * @param int mimic Mimic object
     * @param int index This is index where this mimic is located in this.mimics or this.responses array
     */
    presentActionSheet(type, mimic, index) {
        //this means I'm looking at my own profil
        if (this.userId == null) {
            let actionSheet = this.actionSheetCtrl.create({
                title: 'Options',
                buttons: [
                    {
                        text: 'Delete',
                        role: 'destructive',
                        handler: () => {
                            this.deleteMimic(type, mimic, index);
                        }
                    },
                    {
                        text: 'View this Mimic',
                        handler: () => {
                            this.viewMimic(type, mimic);
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });

            actionSheet.present();
        } else {
            this.viewMimic(type, mimic);
        }
    }

    /**
     * View this specific mimic of a user and load all user's mimics
     * @param any type Mimic type: "response" or "original"
     * @param int mimic Mimic object
     */
    private viewMimic(type, mimic)
    {
        var data = { };
        switch (type) {
            case "original":
                //so you can put this original mimic to the first place in the list
                data['original_mimic_id'] = mimic.id;
                data['user_id'] = mimic.user_id;
                break;            
            case "response":
                //those two go together because you need to get original mimic to set it to the first place to pll its response and put it to the first place
                data['response_mimic_id'] = mimic.id;
                data['original_mimic_id'] = mimic.original_mimic_id;
                //user_id of original mimic because this is how API works, it gets original mimics of a specific user
                data['user_id'] = mimic.original_mimic.user_id;
                break;

        }
        this.nav.setRoot(ListingPage, data);
    }

    /**
     * Delete mimic
     * @param any type Mimic type: "response" or "original"
     * @param int mimic Mimic object
     * @param int index This is index where this mimic is located in this.mimics or this.responses array
     */
    private deleteMimic(type, mimic, index) {
        var data = {};
        switch (type) {
            case "original":
                data['original_mimic_id'] = mimic.id;
                break;
            case "response":
                data['response_mimic_id'] = mimic.id;
                break;
        }

        this.profileService.deleteMimic(data)
            .then(data => {
                if (data.success == true) {
                    if (type == "original") {
                        this.mimics.splice(index, 1);
                    } else {
                        this.responses.splice(index, 1);
                    }
                }
            });
    }

    /**
     * Follow or unfollow this user
     */
    follow()
    {
        this.profileService.follow({id: this.userId})
            .then(data => {
                if (data.type == 'followed') {
                    this.profile.i_am_following_you = true;
                    //increase number of followers by one
                    this.profile.followers+=1;
                } else if (data.type == 'unfollowed') {
                    this.profile.i_am_following_you = false;
                    //decrease number of followers by one
                    this.profile.followers-=1;
                }
            });
    }
}
