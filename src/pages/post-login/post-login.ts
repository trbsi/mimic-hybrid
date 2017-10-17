import { Component, /*ViewChild, Input*/ } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ListingPage } from '../listing/listing';
import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';
import { PostLoginService } from '../post-login/post-login.service';
import { ApiSettings } from '../../components/api-settings/api-settings';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
    selector: 'post-login',
    templateUrl: 'post-login.html'
})
export class PostLogin {

    submit_username:FormGroup;
    loading:any;

    //@ViewChild('usernameInput') usernameInput;

    constructor(public nav:NavController,
                private alertCtrl:AlertController,
                public facebookLoginService:FacebookLoginService,
                public twitterLoginService:TwitterLoginService,
                public postLoginService:PostLoginService,
                public apiSettings:ApiSettings,
                public loadingCtrl:LoadingController,
                private storage:NativeStorage) {
        this.submit_username = new FormGroup({
            username: new FormControl('', Validators.required),
        });

    }

    ionViewDidLoad() {
        /*setTimeout(() => {
         this.usernameInput.setFocus();
         }, 1000);*/
    }

    /**
     * Submit username
     */
    submitUsername() {
        this.loading = this.loadingCtrl.create();

        this.postLoginService.setUsername(this.submit_username.value.username)
            .then((res) => {
                this.loading.present();
                //if everything is ok, set username in storage
                if (res.status == true) {
                    this.storage.getItem('user')
                        .then((userData) => {
                            userData.username = this.submit_username.value.username;
                            this.storage.setItem('user', userData)
                                .then(() => {
                                    this.loading.dismiss();
                                    this.nav.setRoot(ListingPage);
                                },
                                (error) => {
                                    console.error('Error storing item', error);
                                });
                        })
                        .catch((error) => {
                            console.log("error", error);
                        });
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    }

    /**
     * Logout
     */
    logout() {
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
}
