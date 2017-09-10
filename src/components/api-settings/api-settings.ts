import { NgModule } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';

@NgModule()

export class ApiSettings {
	public static API_ENDPOINT='http://mimic.testapi.website/api/';
    allow_entry: string = 'little:cute:chubby';

    constructor(public http:Http, private storage: NativeStorage) 
    {

    }


	createHeaders(headers:Headers) {
    this.storage.getItem('token')
    .then(
      (token) => { console.log('Bearer ' + token);
        headers.append('Authorization', 'Bearer ' + token); 
      },
      (error) => console.error(error)
    );
		  
    headers.append('AllowEntry', btoa(this.allow_entry)); 

    headers.append('Content-Type', 'application/json');

	}


    private handleError(error:any):Promise<any> 
    {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

  	/**
  	 * Post data to sevrer
  	 * @param any postData Data to post to the server
  	 * @param string url Url to post to
  	 */
	post(postData, url)
	{
		var headers = new Headers();
		this.createHeaders(headers);
    let options = new RequestOptions({ headers: headers });
     headers.append('Authorization', 'Bearer sdfsdfsdfdsfdfd'); 
		return this.http.post(ApiSettings.API_ENDPOINT+url, postData, options)
	    .toPromise()
	    .then(response => response.json())
	    .catch(this.handleError);
	}

	/**
     * put login data into a storage
     * @param any loginData Data consists of user_id, token and suername 
     */
	storageSetLoginData(loginData)
	{
        this.storage.setItem('token', loginData.token).then
        (
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
        );

        this.storage.setItem('username', loginData.username).then
        (
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
        );

        this.storage.setItem('user_id', loginData.user_id).then
        (
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
        );

	}

	storageRemoveLoginData()
	{
        this.storage.remove('token');
        this.storage.remove('username');
        this.storage.remove('user_id');
	}


}