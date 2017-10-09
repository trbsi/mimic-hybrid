import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { RootPage } from '../pages/root/root';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Keyboard } from '@ionic-native/keyboard';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ApiSettings } from '../components/api-settings/api-settings';
import { AppService } from './app.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { Device } from '@ionic-native/device';

@Component({
    selector: 'app-root',
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) nav:Nav;

    // make Login the root (or first) page
    rootPage:any = RootPage;
    // rootPage: any = FunctionalitiesPage;
    // rootPage: any = TabsNavigationPage;
    textDir:string = "ltr";

    pages:Array<{title: any, icon: string, component: any}>;
    pushPages:Array<{title: any, icon: string, component: any}>;

    constructor(platform:Platform,
                public splashScreen:SplashScreen,
                public statusBar:StatusBar,
                public translate:TranslateService, 
                private push: Push,
                private keyboard: Keyboard,
                private ga: GoogleAnalytics,
                private apiSettings: ApiSettings,
                private device: Device,
                private appService: AppService,
                private storage:NativeStorage)  
    {
        translate.setDefaultLang('en');
        translate.use('en');

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.splashScreen.hide();
            this.statusBar.styleDefault();

            //this is to show all extra buttons on iphone keyboard
            keyboard.hideKeyboardAccessoryBar(false);
            this.getPushToken();

            this.storage.getItem('user').then((user) => 
            {
                //google analytics
                this.ga.startTrackerWithId(ApiSettings.GA_TRACKER_ID).then(() => 
                {
                    console.log('Google analytics is ready now');
                    //the component is ready and you can call any method here
                    this.ga.setAllowIDFACollection(true);
                    this.ga.setAppVersion(ApiSettings.APP_VERSION);
                    this.ga.setUserId(user.user_id);
                })
                .catch(e => console.log('Error starting GoogleAnalytics', e));  

            },
            error => {
                //user not found
            });

        });

        platform.resume.subscribe(() => {
            this.getPushToken();
        });
        //platform.pause.subscribe(() => { console.log(" izisao iz appa") });


        this.translate.onLangChange.subscribe((event:LangChangeEvent) => {
            if (event.lang == 'ar') {
                platform.setDir('rtl', true);
                platform.setDir('ltr', false);
            }
            else {
                platform.setDir('ltr', true);
                platform.setDir('rtl', false);
            }

        });

    }

    private getPushToken() 
    {  
        this.storage.getItem('user').then((user) => 
        {
            this.push.hasPermission()
            .then((res: any) => {
                //'We have permission to send push notifications');
                const options: PushOptions = {
                    ios: {
                        alert: true,
                        badge: true,
                        sound: true,
                        clearBadge: true
                    }
                };

                const pushObject: PushObject = this.push.init(options);
                pushObject.on('notification').subscribe((notification: any) => {
                    console.log('Received a notification', notification);

                    //remove notification div if it exists
                    if(document.getElementById("my-notification")) {
                        document.getElementById("my-notification").remove();
                    }

                    //append div and show alert
                    var d1 = document.getElementsByClassName('ion-page')[0];
                    d1.insertAdjacentHTML('beforeend', '<div id="my-notification">'+
                    '<span id="notification-title">'+notification.title+'</span>'+
                    '<span id="notification-body">'+notification.message+'</span>'+
                    '</div>');
                    document.getElementById('my-notification').className ='notification-alert';

                });

                pushObject.on('registration').subscribe((registration: any) => {
                    //registration: {registrationId: "24e90e7bbee5103d1f8feaa9150f5f8f9e4b6b148f51f83add41ad7295c74291", registrationType: "APNS"}
                    var pushData = {
                        push_token: registration.registrationId,
                        device: 'ios',
                        device_id: this.device.uuid
                    };

                    //Save push data on server
                    this.appService.savePushToken(pushData);
                    
                });

                pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
                
            }, 
            (error) => {
                console.log(error);
            });
        },
        (error) => {
            //user not found
        });
    }
}
