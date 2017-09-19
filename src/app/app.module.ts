import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http } from '@angular/http';

//USING
import { Search } from '../pages/search/search';
import { ListingPage } from '../pages/listing/listing';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { SearchService } from '../pages/search/search.service';
import { PostLogin } from '../pages/post-login/post-login';
import { AddMimic } from '../pages/add-mimic/add-mimic';
import { ApiSettings } from '../components/api-settings/api-settings';
import { NativeStorage } from '@ionic-native/native-storage';

import { FollowersPage } from '../pages/followers/followers';
//import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
//import { SettingsPage } from '../pages/settings/settings';
//import { SignupPage } from '../pages/signup/signup';
//import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';

import { PreloadImage } from '../components/preload-image/preload-image';
//import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
//import { ShowHideInput } from '../components/show-hide-password/show-hide-input';

//USING SERVICES
import { ListingService } from '../pages/listing/listing.service';
import { ProfileService } from '../pages/profile/profile.service';
import { FacebookLoginService } from '../pages/facebook-login/facebook-login.service';
//import { GoogleLoginService } from '../pages/google-login/google-login.service';
import { TwitterLoginService } from '../pages/twitter-login/twitter-login.service';
import { LanguageService } from '../providers/language/language.service';
import { LoginService } from '../pages/login/login.service';
import { PostLoginService } from '../pages/post-login/post-login.service';

//USING MODULE
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { VideoPlayerModule } from '../components/video-player/video-player.module';

//OTHER
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Keyboard } from '@ionic-native/keyboard';
//import { Geolocation } from '@ionic-native/geolocation';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

//Functionalities
import { FacebookLoginPage } from '../pages/facebook-login/facebook-login';
//import { GoogleLoginPage } from '../pages/google-login/google-login';
import { TwitterLoginPage } from '../pages/twitter-login/twitter-login';

export function createTranslateLoader(http:Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
    declarations: [
        //USING
        Search,
        ListingPage,
        MyApp,
        LoginPage,
        ProfilePage,
        FacebookLoginPage,
        //GoogleLoginPage,
        TwitterLoginPage,
        PostLogin,
        AddMimic,

        FollowersPage,
        //WalkthroughPage,
        //SettingsPage,
        //SignupPage,
        //ForgotPasswordPage,
        TermsOfServicePage,
        PrivacyPolicyPage,
        PreloadImage,
        //ShowHideContainer,
        //ShowHideInput,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
        VideoPlayerModule,
        ApiSettings,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        //USING
        MyApp,
        Search,
        ListingPage,
        LoginPage,
        ProfilePage,
        FacebookLoginPage,
        //GoogleLoginPage,
        TwitterLoginPage,
        PostLogin,
        AddMimic,

        FollowersPage,
        //WalkthroughPage,
        //SettingsPage,
        //ForgotPasswordPage,
        //SignupPage, 
        TermsOfServicePage,
        PrivacyPolicyPage,
    ],
    providers: [
        //USING
        SearchService,
        ProfileService,
        FacebookLoginService,
        //GoogleLoginService,
        TwitterLoginService,
        LanguageService,
        NativeStorage,
        LoginService,
        PostLoginService,
        ListingService,

        SplashScreen,
        StatusBar,
        SocialSharing,
        InAppBrowser,
        Facebook,
        GooglePlus,
        Keyboard,
        //Geolocation,
        TwitterConnect,
        ImagePicker,
        Crop,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
