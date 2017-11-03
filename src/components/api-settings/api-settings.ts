import { NgModule } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController, LoadingController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@NgModule()

export class ApiSettings {
    //public static API_ENDPOINT = 'http://mimic.blitzerapp.website/api/';
    public static API_ENDPOINT = 'http://mimic.blitzerapp.com/api/';
    public static APP_VERSION = '1.2';
    public static GA_TRACKER_ID = 'UA-107329891-1';
    allow_entry:string = 'almasi:slatkasi';
    loading:any;

    constructor(public http:Http,
                private storage:NativeStorage,
                private alertCtrl:AlertController,
                public loadingCtrl:LoadingController,
                private transfer:FileTransfer) {

    }

    /**
     * [createHeaders description]
     * @param {Headers} headers [description]
     * @param string type What type of request to send: get, post
     */
    private createHeaders(headers:Headers, type) {
        headers.append('AllowEntry', btoa(this.allow_entry));
        if (type != 'upload') {
            headers.append('Content-Type', 'application/json');
        }
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
     * @param any serverData Data to post to the server
     * @param string url Url to post to
     * @param string type What type of request to send: get, post
     */
    sendRequest(serverData, url, type, showLoading = true) {
        if (showLoading === true) {
            this.loading = this.loadingCtrl.create({
                content: 'Give Mimic a second :)',
            });
            this.loading.present();
        }

        var headers = new Headers();
        return this.storage.getItem('user')
            .then(
            (userData) => {
                this.createHeaders(headers, type);
                headers.append('Authorization', 'Bearer ' + userData.token);

                if (type == 'post') {
                    return this.doPost(serverData, url, headers, showLoading);
                } else if (type == 'get') {
                    return this.doGet(serverData, url, headers, showLoading);
                } else if (type == 'delete') {
                    return this.doDelete(serverData, url, headers, showLoading);
                } else if (type == 'upload') {
                    return this.doUpload(serverData, url, headers, showLoading);
                }

            },
            //couldn't find user, do normal post
            (error) => {
                this.createHeaders(headers, type);
                //headers.append('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjk2LCJpc3MiOiJodHRwOi8vd3d3LmdvbWltaWMuY29tL2FwaS9hdXRoL2xvZ2luIiwiaWF0IjoxNTA4MTg5OTk4LCJleHAiOjE1MTA4ODk5OTgsIm5iZiI6MTUwODE4OTk5OCwianRpIjoiN3lNNFdrRjBZU1BMaFRraSJ9.D27R5COvWgHOMWSWvQ_83-aQ5rqmKjTShRfu9bvuACY');
                if (type == 'post') {
                    return this.doPost(serverData, url, headers, showLoading);
                } else if (type == 'get') {
                    return this.doGet(serverData, url, headers, showLoading);
                } else if (type == 'delete') {
                    return this.doDelete(serverData, url, headers, showLoading);
                } else if (type == 'upload') {
                    return this.doUpload(serverData, url, headers, showLoading);
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
    private doPost(postData, url, headers, showLoading) {
        let options = new RequestOptions({headers: headers});
        return this.http.post(ApiSettings.API_ENDPOINT + url, postData, options)
            .toPromise()
            .then((response) => {
                if (showLoading === true) {
                    this.loading.dismiss();
                }
                return this.handleSuccess(response);
            })
            .catch((error) => {
                if (showLoading === true) {
                    this.loading.dismiss();
                }
                return this.handleError(error);
            });
    }

    /**
     * This is where you send request to a server
     * @param any getData Url parameters
     * @param string url Url to post to
     * @param Headers headers What headers to include
     */
    private doGet(getData, url, headers, showLoading) {
        let options = new RequestOptions({params: getData, headers: headers});
        return this.http.get(ApiSettings.API_ENDPOINT + url, options)
            .toPromise()
            .then((response) => {
                if (showLoading === true) {
                    this.loading.dismiss();
                }
                return this.handleSuccess(response);
            })
            .catch((error) => {
                if (showLoading === true) {
                    this.loading.dismiss();
                }
                return this.handleError(error);
            });
    }

    /**
     * This is where you send request to a server
     * @param any data Data to send to server
     * @param string url Url to post to
     * @param Headers headers What headers to include
     */
    private doDelete(data, url, headers, showLoading) {
        let options = new RequestOptions({params: data, headers: headers});
        return this.http.delete(ApiSettings.API_ENDPOINT + url, options)
            .toPromise()
            .then((response) => {
                if (showLoading === true) {
                    this.loading.dismiss();
                }
                return this.handleSuccess(response);
            })
            .catch((error) => {
                if (showLoading === true) {
                    this.loading.dismiss();
                }
                return this.handleError(error);
            });
    }


    /**
     * Upload file to server
     * @param any data Data to send to server
     * @param string url Url to post to
     */
    private doUpload(data, url, headers, showLoading) {
        const fileTransfer:FileTransferObject = this.transfer.create();

        let options:FileUploadOptions = {
            headers: headers,
            params: data,
            fileKey: 'file', //this is how you fetch file on backend
            fileName: data['fileName']
        }

        return fileTransfer.upload(data.filePath, ApiSettings.API_ENDPOINT + url, options)
            .then((data) => {
                if (showLoading === true) {
                    this.loading.dismiss();
                }
                return Promise.resolve(JSON.parse(data.response));
            }, (error) => {
                if (showLoading === true) {
                    this.loading.dismiss();
                }

                let alert = this.alertCtrl.create({
                    title: 'There was a problem',
                    subTitle: JSON.parse(error.body).error.message,
                    buttons: ['Ok']
                });
                alert.present();

                return Promise.reject(JSON.parse(error.body));
            });
    }


    /**
     * put login data into a storage
     * @param any loginData Data consists of user_id, token and suername
     */
    storageSetLoginData(loginData) {
        return this.storage.setItem('user', {
            'token': loginData.token,
            'username': loginData.username,
            'user_id': loginData.user_id
        })
            .then(() => {
                console.log('User storage set');
            },
                error => console.error('Error storing user storage', error)
        );
    }

    storageRemoveLoginData() {
        this.storage.remove('user');
    }

    /**
     * Present alert
     * @param string title    
     * @param string subTitle 
     */
    presentAlert(title, subTitle) {
      const alert = this.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        buttons: ['OK']
      });
      alert.present();
    }

}