import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, ModalController } from 'ionic-angular';

import 'rxjs/Rx';

import { ListingModel } from './listing.model';
import { ProfilePage } from '../profile/profile';
import { FabContainer } from 'ionic-angular';
import { VgAPI } from 'videogular2/core';

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
import { ListingService } from '../listing/listing.service';

@Component({
    selector: 'listing-page',
    templateUrl: 'listing.html',
})
export class ListingPage {
    listing:ListingModel = new ListingModel();
    loading:any;
    mainMenuOpened:boolean;

    //NAV PARAMS
    hashtagId = null; //filter mimics by hashtag_id
    userId = null; //filter mimics by user

    //MIMICS
    mimicsList = []; //list of all mimics from the server
    originalMimicsCount:number; //total number of original mimics
    responseMimicsCount:number; //total number of original mimics
    currentMimicResponses = []; // current responses of one original mimic you are looking at
    currentResponseMimic:object; // current response mimic displaying on the screen
    currentOriginalMimic:object; // current original mimic displaying on the screen
    originalMimicPaging = 0;
    responseMimicPaging = 0;
    filterMimics = {};

    //VIDEO
    videoOriginal = []; //original video instances
    videoResponse = []; //response video instances

    @ViewChild('originalMimicSlide') originalMimicSlide:Slides;
    @ViewChild('responseMimicSlide') responseMimicSlide:Slides;

    constructor(public nav:NavController, private alertCtrl:AlertController,
                public loadingCtrl:LoadingController, public facebookLoginService:FacebookLoginService,
                public twitterLoginService:TwitterLoginService,
                public apiSettings:ApiSettings, public listingService:ListingService,
                public navParams:NavParams,
                public modalCtrl: ModalController) 
    {
        this.mainMenuOpened = false;
        //filter mimics by hashtag
        if (this.navParams.get('hashtag_id')) {
            this.filterMimics['hashtag_id'] = this.navParams.get('hashtag_id');
        }

        //filter mimics by user
        if (this.navParams.get('user_id')) {
            this.filterMimics['user_id'] = this.navParams.get('user_id');

            //use this parameter to put that specific original mimic on the first place of a list
            if (this.navParams.get('original_mimic_id')) {
                this.filterMimics['original_mimic_id'] = this.navParams.get('original_mimic_id'); 
            }

            //use this parameter to put that specific response mimic on the first place of a list
            if (this.navParams.get('response_mimic_id')) {
                this.filterMimics['response_mimic_id'] = this.navParams.get('response_mimic_id'); 
            }
        }

        
    }

    ionViewDidLoad() {
        this.getMimicsFromServer();
    }    

    private getMimicsFromServer() {
        this.listingService.getAllMimics(this.filterMimics).then((data) => {
            this.mimicsList = data.mimics;

            this.originalMimicsCount = data.count;

            this.currentOriginalMimic = this.mimicsList[0];
            this.responseMimicsCount = this.currentOriginalMimic['mimic'].responses_count;
            this.currentMimicResponses = this.currentOriginalMimic['mimic_responses'];
            this.currentResponseMimic = this.currentMimicResponses[0];

            this.slideAllMimicsToBeginning();

            //if responses are empty disable sliding
            if(this.currentMimicResponses.length == 0) {
                this.responseMimicSlide.lockSwipeToNext(true);
                this.responseMimicSlide.lockSwipeToPrev(true);
            }
        });
    }

    /**
     * Slide original and response mimics to beginning, thus showing on screen mimics under inde 0. 
     * Used when refreshing the page and adding new original mimic
     */
    private slideAllMimicsToBeginning()
    {
        this.originalMimicSlide.slideTo(0, 0, false);  //set slide back to index 0
        this.responseMimicSlide.slideTo(0, 0, false);  //set slide back to index 0
    }

    /**
     * I need to use modal here because this is the only way to pass data from modal to this controller
     * @param any params Any params going to profile modal
     */
    private presentProfileModal(params) {
       let profileModal = this.modalCtrl.create(AddMimic, params);
       profileModal.onDidDismiss(data => {
            if(data) {
                switch (data.mimicType) {
                    case "original":
                        this.mimicsList.unshift(data.uploadedMimic);
                        this.currentMimicResponses = []; //we have no responses
                        this.currentResponseMimic = null; //we have no current response mimic
                        this.slideAllMimicsToBeginning();
                        break;
                    case "response":
                        this.currentMimicResponses.unshift(data.uploadedMimic);
                        this.currentResponseMimic = data.uploadedMimic; // current response mimic is this uploaded one
                        this.responseMimicSlide.slideTo(0, 0, false);  //set slide back to index 0
                        break;
                }
            }
       }); 
       profileModal.present();
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
                    user_id: null //it means that I'm opening my own profile
                });
                break;
            case "refresh":
                this.refresh();
                break;
            case "search":
                this.nav.push(Search);
                break;
            case "add-mimic":
                 this.presentProfileModal({});
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
        this.filterMimics = {};
        this.getMimicsFromServer();
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

    /**
     * Upvote mimic
     * @param int id Id of a mimic
     * @param string type "original" or "response"
     */
    upvote(id, type) {
        this.listingService.upvote(id, type).then((data) => {

            if (data.type == "downvoted") {
                switch (type) {
                    case "response":
                        this.currentResponseMimic['upvoted'] = 0;
                        this.currentResponseMimic['upvote'] -= 1;
                        break;
                    case "original":
                        this.currentOriginalMimic['mimic'].upvoted = 0;
                        this.currentOriginalMimic['mimic'].upvote -= 1;
                        break;
                }

            }

            if (data.type == "upvoted") {
                switch (type) {
                    case "response":
                        this.currentResponseMimic['upvoted'] = 1;
                        this.currentResponseMimic['upvote'] += 1;
                        break;
                    case "original":
                        this.currentOriginalMimic['mimic'].upvoted = 1;
                        this.currentOriginalMimic['mimic'].upvote += 1;
                        break;
                }
            }
        });
    }

    /**
     * Reply to original mimic
     * @param int id Original mimic id
     */
    replyToMimic(id) {
        var params = {
            original_mimic_id: id,
            reply_to_mimic: true,
        };

        this.presentProfileModal(params);
    }

    logout(fab:FabContainer) {
        this.closeFab(fab);

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
    private slideChanged(type, index) {
        switch (type) {
            case "original":
                if (this.videoOriginal[index] != undefined) {
                    this.videoOriginal[index].pause();
                }
                break;
            case "response":
                if (this.videoResponse[index] != undefined) {
                    this.videoResponse[index].pause();
                }
                break;
        }

    }


    /**
     * *****************ORIGINALS***********************
     * When side has been changed
     * @param string type "original" or "response"
     */
    loadNextOriginal(type) {
        let newIndex = this.originalMimicSlide.getActiveIndex();

        //if newIndex is bigger than total count just return this so nothing can happen
        if (newIndex + 1 >= this.originalMimicsCount) {
            return;
        }

        //if this is the end, try to get more mimics (preload them)
        if (this.originalMimicSlide.isEnd()) {
            this.loadMoreOriginals();
        }

        //set current original mimic you are looking at
        this.currentOriginalMimic = this.mimicsList[newIndex];
        //set new current mimic response and reset numbering
        this.setCurrentMimicResponses(newIndex);
        //when slide is changed pause previous video
        this.slideChanged(type, newIndex - 1);
    }

    loadPrevOriginal(type) {

        let newIndex = this.originalMimicSlide.getActiveIndex();
        //set current original mimic you are looking at
        this.currentOriginalMimic = this.mimicsList[newIndex];

        //set new current mimic response and reset numbering
        this.setCurrentMimicResponses(newIndex);

        //when slide is changed pause previous video
        this.slideChanged(type, newIndex + 1);
    }

    /**
     * Load more original mimics
     */
    private loadMoreOriginals() {
        // this.originalMimicSlide.lockSwipeToNext(true);
        this.originalMimicPaging += 1; //increase paging
        this.listingService.getAllMimics(Object.assign(this.filterMimics, {page: this.originalMimicPaging}))
            .then((data) => {
                this.mimicsList = this.mimicsList.concat(data.mimics);
                //  this.originalMimicSlide.lockSwipeToNext(false);
            });
    }

    /**
     * *****************RESPONSES***********************
     * When side has been changed
     * @param string type "original" or "response"
     */
    loadNextResponse(type) {

        var newIndex = this.responseMimicSlide.getActiveIndex();

        //if newIndex is bigger than total count just return this so nothing can happen
        if (newIndex + 1 >= this.responseMimicsCount) {
            return;
        }

        //if this is the end, try to get more mimics
        if (this.responseMimicSlide.isEnd()) {
            this.loadMoreResponses();
        }

        //set current response mimic you are looking at
        this.currentResponseMimic = this.currentMimicResponses[newIndex];
        //when slide is changed pause previous video
        this.slideChanged(type, newIndex - 1);


    }

    loadPrevResponse(type) {

        let newIndex = this.responseMimicSlide.getActiveIndex();
        //set current response mimic you are looking at
        this.currentResponseMimic = this.currentMimicResponses[newIndex];

        //when slide is changed pause previous video
        this.slideChanged(type, newIndex + 1);
    }

    /**
     * Load more mimic responses
     */
    private loadMoreResponses() {
        //this.responseMimicSlide.lockSwipeToNext(true); 
        this.responseMimicPaging += 1; //increase paging
        this.listingService.loadMoreResponses(this.responseMimicPaging, this.currentOriginalMimic['mimic'].id)
            .then((data) => {
                this.currentMimicResponses = this.currentMimicResponses.concat(data.mimics);
                //this.responseMimicSlide.lockSwipeToNext(false);
            });
    }


    /**
     * When you change original mimic you have to set new responses to show for that mimic
     */
    private setCurrentMimicResponses(currentMimicOriginalIndex) {
        this.currentMimicResponses = this.mimicsList[currentMimicOriginalIndex].mimic_responses;
        //if responses are empty disable sliding
        if(this.currentMimicResponses.length == 0) {
            this.responseMimicSlide.lockSwipeToNext(true);
            this.responseMimicSlide.lockSwipeToPrev(true);
        } else {
            this.responseMimicSlide.lockSwipeToNext(false);
            this.responseMimicSlide.lockSwipeToPrev(false);
        }
        this.currentResponseMimic = this.currentMimicResponses[0];
        this.videoResponse = []; //reset our video array
        this.responseMimicSlide.slideTo(0, 0, false);  //set slide back to index 0 
        this.responseMimicPaging = 0; //reset paging
        this.responseMimicsCount = this.mimicsList[currentMimicOriginalIndex].mimic.responses_count;  //set new response count
    }

    //SLIDES

    //VIDEOS
    /**
     * When player is ready initalize it
     * @param {VgAPI}  api
     * @param string type "original" or "response"
     */
    onPlayerReady(api:VgAPI, type, n) {
        switch (type) {
            case "original":
                this.videoOriginal[n] = api;
                break;
            case "response":
                this.videoResponse[n] = api;
                break;
        }
    }

    //VIDEOS

}
