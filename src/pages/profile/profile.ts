import { Component } from '@angular/core';
import { MenuController, App, NavParams, SegmentButton, ActionSheetController } from 'ionic-angular';
import { FollowersPage } from '../followers/followers';
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
    userId = null;

    constructor(public menu:MenuController,
                public app:App,
                public navParams:NavParams,
                public profileService:ProfileService,
                public actionSheetCtrl: ActionSheetController) 
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



    /**
     * Do some action when user clicks on mimi on someone's or his profile
     * @param any type Mimic type: "response" or "original"
     * @param int mimic_id Mimic id
     * @param int index This is index where this mimic is located in this.mimics or this.responses array
     */
     presentActionSheet(type, mimic_id, index) {
         //this means I'm looking at my own profil
         if(this.userId == null) {
           let actionSheet = this.actionSheetCtrl.create({
             title: 'Options',
             buttons: [
               {
                 text: 'Delete',
                 role: 'destructive',
                 handler: () => {
                   this.deleteMimic(type, mimic_id, index);
                 }
               },
               {
                 text: 'View this Mimic',
                 handler: () => {
                   console.log('Archive clicked');
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
         }
     }

     /**
      * Delete mimic
      * @param any type Mimic type: "response" or "original"
      */
    private deleteMimic(type, mimic_id, index)
    {
        var data = {};
        switch (type) {
            case "original":
                data['original_mimic_id'] = mimic_id;
                break;
            case "response":
                data['response_mimic_id'] = mimic_id;
                break;
        }

        this.profileService.deleteMimic(data)
        .then(data => {
            if(data.success == true) {
                if(type == "original") {
                    this.mimics.splice(index, 1);
                } else {
                    this.responses.splice(index, 1);
                }
            }
        });
    }
}
