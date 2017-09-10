import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import 'rxjs/Rx';

import { ListingModel } from './listing.model';
import { ProfilePage } from '../profile/profile';
import { FabContainer } from 'ionic-angular';
import { VgAPI } from 'videogular2/core';
import { VideoPlaylistModel } from '../video-playlist/video-playlist.model';

import { AddMimic } from '../add-mimic/add-mimic';
import { Search } from '../search/search';
import { LoginPage } from '../login/login';

import { AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
//import { enableInlineVideo } from 'iphone-inline-video';
import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';
import { ApiSettings } from '../../components/api-settings/api-settings';

@Component({
    selector: 'listing-page',
    templateUrl: 'listing.html',
})
export class ListingPage {
    listing:ListingModel = new ListingModel();
    loading:any;
    mainMenuOpened:boolean;

    //VIDEO
    start_playing:boolean = false;
    videoOriginal:VgAPI;
    videoResponse:VgAPI;
    video_playlist_model:VideoPlaylistModel = new VideoPlaylistModel();

    @ViewChild('originalMimicSlide') originalMimicSlide:Slides;
    @ViewChild('responseMimicSlide') responseMimicSlide:Slides;

    constructor(public nav:NavController, private alertCtrl:AlertController,
                public loadingCtrl:LoadingController, public facebookLoginService:FacebookLoginService,
                public twitterLoginService:TwitterLoginService,
                public apiSettings:ApiSettings) {
        this.loading = this.loadingCtrl.create();
        this.mainMenuOpened = false;
    }


    ionViewDidLoad() {
        this.loading.present();
        this.loading.dismiss();
    }

    ionViewDidEnter() {
        //calclate mimic info position
        document.getElementById('mimic-info-top').style.top = this.calculateMimicInfoPosition('top') - 10 + "px";
        document.getElementById('mimic-info-bottom').style.bottom = this.calculateMimicInfoPosition('bottom') + 10 + "px";
    }

    /**
     * Dynamically calculate mimic info position
     * @param string type "top" or "bottom"
     */
    calculateMimicInfoPosition(type) {
        return document.getElementById('split-' + type).clientHeight - document.getElementsByClassName('slide-zoom')[0].clientHeight - document.getElementById('mimic-info-' + type).clientHeight;
    }


    /**
     * Open specific page
     * @param string page Which page to open
     */
    openPage(page:string, fab:FabContainer) {
        this.closeFab(fab);

        switch (page) {
            case "profile":
                this.nav.push(ProfilePage, {
                    //user: item
                });
                break;
            case "refresh":
                this.refresh();
                break;
            case "search":
                this.nav.push(Search);
                break;
            case "add-mimic":
                this.nav.push(AddMimic);
                break;
        }
    }

    /**
     * Close FAB menu
     * @param FabContainer dab
     */
    closeFab(fab:FabContainer) {
        this.mainMenuOpened = false;
        fab.close();
    }


    /**
     * refresh mimic page
     */
    refresh() {
        alert('refresh');
    }

    /**
     * Open user profile
     * @param int id User id
     */
    openUserProfile(id) {
        alert(id);
    }

    /**
     * Upvote mimic
     * @param int id Id of a mimic
     */
    upvote(id) {
        alert(id);
    }

    /**
     * Reply to original mimic
     * @param int id Original mimic id
     */
    replyToMimic(id) {
        this.nav.push(AddMimic, {
            original_mimic_id: id
        });
    }

    logout(fab:FabContainer) {
        this.closeFab(fab);
        //@TODO remove token
        let alert = this.alertCtrl.create({
            title: 'Logout',
            message: 'Do you want to logout?',
            buttons: [
                {
                    text: 'Yes',
                    role: 'cancel',
                    handler: () => {
                        this.apiSettings.storageRemoveLoginData();
                        this.facebookLoginService.doFacebookLogout();
                        this.twitterLoginService.doTwitterLogout();
                        this.nav.setRoot(LoginPage);
                    }
                },
                {
                    text: 'No',
                    handler: () => {
                    }
                }
            ]
        });
        alert.present();

    }

    //SLIDES
    /**
     * When side has been changed
     * @param string type "original" or "response"
     */
    slideChanged(type) {
        switch (type) {
            case "original":
                if (this.videoOriginal != undefined) {
                    this.videoOriginal.pause();
                }
                console.log(this.originalMimicSlide.isEnd());
                break;
            case "response":
                if (this.videoResponse != undefined) {
                    this.videoResponse.pause();
                }
                console.log(this.responseMimicSlide.isEnd());
                break;
        }
    }


    //VIDEOS
    /**
     * When player is ready initalize it
     * @param {VgAPI}  api
     * @param string type "original" or "response"
     */
    onPlayerReady(api:VgAPI, type) {
        switch (type) {
            case "original":
                this.videoOriginal = api;
                break;
            case "response":
                this.videoResponse = api;
                break;
        }

    }

    dismissLoader() {
        // Check if the current instance is usable
        if (this.loading !== undefined) {
            // If it's not usable, then create a new one
            this.loading.dismiss();
        }
    }

    //VIDEOS
}
