import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { ListingPage } from '../listing/listing';
import { PostLogin } from '../post-login/post-login';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
//import { GoogleLoginService } from '../google-login/google-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';
import { LoginService } from '../login/login.service';
import { ApiSettings } from '../../components/api-settings/api-settings';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})
export class LoginPage {
    main_page:{ component: any };
    loading:any;

    constructor(public nav:NavController, private storage:NativeStorage, public login_service:LoginService,
                public facebookLoginService:FacebookLoginService,
                //public googleLoginService:GoogleLoginService,
                public twitterLoginService:TwitterLoginService,
                public loadingCtrl:LoadingController,
                public apiSettings:ApiSettings) 
    {
        //see if user is loggedin, if he is check if he set username
        this.storage.getItem('token')
            .then(data => {
                //if he has username you can redirect to main screen
                this.storage.getItem('username').then(
                        data => {
                        //username not set, redirect to post login
                        if (data == false || data == null) {
                            this.nav.setRoot(PostLogin);
                        } else {
                            this.nav.setRoot(ListingPage);
                        }

                    },
                        error => {
                        this.nav.setRoot(PostLogin);
                    }
                );

            },
                error => {
                console.log(error);
            }
        );

        this.main_page = {component: PostLogin};
    }

    //@TODO - not necessary, just for testing
    doLogin() {
        this.storage.setItem('token', 'value').then
        (
            () => console.log('Stored item!'),
                error => console.error('Error storing item', error)
        );

        this.storage.setItem('username', false).then
        (
            () => console.log('Stored item!'),
                error => console.error('Error storing item', error)
        );

        this.nav.setRoot(this.main_page.component);
    }

    doFacebookLogin() {
        this.loading = this.loadingCtrl.create();

        this.facebookLoginService.doFacebookLogin()
            .then((res) => {
                //send request to server
                this.login_service.loginOnServer(res, 'facebook')
                    .then(response => {
                        this.apiSettings.storageSetLoginData(response); 
                        this.nav.setRoot(this.main_page.component);
                    })
                    .catch(error => {
                        console.log("FB login error", error);
                    });

                this.loading.dismiss();
            }, (err) => {
                console.log("Facebook Server Login error", err);
            });
    }

    /*doGoogleLogin() {
     this.loading = this.loadingCtrl.create();

     // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app

     this.googleLoginService.trySilentLogin()
     .then((data) => {
     // user is previously logged with Google and we have his data we will let him access the app
     this.nav.setRoot(this.main_page.component);
     }, (error) => {
     //we don't have the user data so we will ask him to log in
     this.googleLoginService.doGoogleLogin()
     .then((res) => {
     this.loading.dismiss();
     this.nav.setRoot(this.main_page.component);
     }, (err) => {
     console.log("Google Login error", err);
     });
     });
     }*/

    doTwitterLogin() {
        this.loading = this.loadingCtrl.create();

        //we don't have the user data so we will ask him to log in
        this.twitterLoginService.doTwitterLogin()
            .then((res) => {
                //send request to server
                this.login_service.loginOnServer(res, 'twitter')
                    .then((response) => {
                        this.apiSettings.storageSetLoginData(response);
                        this.nav.setRoot(this.main_page.component);
                    })
                    .catch(error => {
                        console.log("FB login error", error);
                    });

                this.loading.dismiss();
            }, (err) => {
                console.log("Twitter Login error", err);
            });
    }

}
