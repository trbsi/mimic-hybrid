import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { ListingPage } from '../listing/listing';
import { PostLogin } from '../post-login/post-login';
import { LoginPage } from '../login/login';

import 'rxjs/Rx';

@Component({
    selector: 'root-page',
    templateUrl: 'root.html'
})
export class RootPage {
    constructor(public nav:NavController,
                public platform:Platform,
                private storage:NativeStorage) {
        this.platform.ready().then((readySource) => {
            this.redirectUserToTheRightPage();
        });
    }


    /**
     * Redirect user to mimics page or post login page
     */
    private redirectUserToTheRightPage() {
        //see if user is loggedin, if he is check if he set username
        this.storage.getItem('user')
            .then((data) => {
                //if he has username you can redirect to main screen
                if (data.username == false || data.username == null) {
                    this.nav.setRoot(PostLogin);
                } else {
                    this.nav.setRoot(ListingPage);
                }
            },
                error => {
                this.nav.setRoot(LoginPage);
            }
        );
    }
}
