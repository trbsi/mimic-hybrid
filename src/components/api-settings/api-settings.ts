import { NgModule } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController, LoadingController } from 'ionic-angular';

@NgModule()

export class ApiSettings {
    public static API_ENDPOINT = 'http://mimic.testapi.website/api/'; //@TODO change to live
    allow_entry:string = 'almasi:slatkasi';
    loading:any;

    constructor(public http:Http, private storage:NativeStorage, private alertCtrl:AlertController,
                public loadingCtrl:LoadingController) {

    }


    private createHeaders(headers:Headers) {
        headers.append('AllowEntry', btoa(this.allow_entry));
        headers.append('Content-Type', 'application/json');
    }


    private handleError(error) {
        let alert = this.alertCtrl.create({
            title: 'There was a problem',
            subTitle: error.json().error.message,
            buttons: ['Ok']
        });
        alert.present();

        return Promise.reject(error.json());
    }

    private handleSuccess(success) {
        return Promise.resolve(success.json());
    }

    /**
     * Post data to sevrer
     * @param any postData Data to post to the server
     * @param string url Url to post to
     * @param string type What type of request to send: get, post
     */
    sendRequest(data, url, type) {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        var headers = new Headers();
        return this.storage.getItem('token')
            .then(
            (token) => {
                headers.append('Authorization', 'Bearer ' + token);
                this.loading.dismiss();
                if (type == 'post') {
                    return this.doPost(data, url, headers);
                } else if (type == 'get') {
                    return this.doGet(data, url, headers);
                } else if (type == 'delete') {
                    return this.doDelete(data, url, headers);
                }
            },
            //couldn't find token, do normal post
            (error) => {
                //@TODO remove this, this is just for testing
                headers.append('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsImlzcyI6Imh0dHA6Ly9taW1pYy50ZXN0YXBpLndlYnNpdGUvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE1MDU2ODI2NjAsImV4cCI6MTUwODM4MjY2MCwibmJmIjoxNTA1NjgyNjYwLCJqdGkiOiJ1QWhWNE5oNnlrZ2o0UzF2In0.mAtyFB3ZDt38Rel-o7sXN-8Z7SQq8B4YHAa-HChZba0');
                this.loading.dismiss();
                if (type == 'post') {
                    return this.doPost(data, url, headers);
                } else if (type == 'get') {
                    return this.doGet(data, url, headers);
                } else if (type == 'delete') {
                    return this.doDelete(data, url, headers);
                }
            }
        );
    }

    /**
     * This is where you send request to a server
     * @param any postData Data to post to the server
     * @param string url Url to post to
     * @param Headers headers What headers to include
     */
    private doPost(postData, url, headers) {
        this.createHeaders(headers);
        let options = new RequestOptions({headers: headers});
        return this.http.post(ApiSettings.API_ENDPOINT + url, postData, options)
            .toPromise()
            .then((response) => {
                return this.handleSuccess(response);
            })
            .catch((error) => {
                return this.handleError(error);
            });
    }

    /**
     * This is where you send request to a server
     * @param any getData Url parameters
     * @param string url Url to post to
     * @param Headers headers What headers to include
     */
    private doGet(getData, url, headers) {
        this.createHeaders(headers);
        let options = new RequestOptions({params: getData, headers: headers});
        return this.http.get(ApiSettings.API_ENDPOINT + url, options)
            .toPromise()
            .then((response) => {
                return this.handleSuccess(response);
            })
            .catch((error) => {
                return this.handleError(error);
            });
    }

    /**
     * This is where you send request to a server
     * @param any data Data to send to server
     * @param string url Url to post to
     * @param Headers headers What headers to include
     */
    private doDelete(data, url, headers) {
        this.createHeaders(headers);
        let options = new RequestOptions({params: data, headers: headers});
        return this.http.delete(ApiSettings.API_ENDPOINT + url, options)
            .toPromise()
            .then((response) => {
                return this.handleSuccess(response);
            })
            .catch((error) => {
                return this.handleError(error);
            });
    }

    /**
     * put login data into a storage
     * @param any loginData Data consists of user_id, token and suername
     */
    storageSetLoginData(loginData) {
        return this.storage.setItem('token', loginData.token)
            .then(
            () => {
                console.log('Token set');
                return this.storage.setItem('username', loginData.username)
                    .then(
                    () => {
                        console.log('Username set!');
                        return this.storage.setItem('user_id', loginData.user_id)
                            .then(
                            () => {
                                console.log('User ID set!')
                            },
                                error => console.error('Error storing ser ID', error)
                        );
                    },
                        error => console.error('Error storing username', error)
                );
            },
                error => console.error('Error storing token', error)
        );
    }

    storageRemoveLoginData() {
        this.storage.remove('token');
        this.storage.remove('username');
        this.storage.remove('user_id');
    }


}