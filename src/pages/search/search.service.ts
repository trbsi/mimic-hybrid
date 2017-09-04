import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { SearchModel } from './search.model';

@Injectable()
export class SearchService {
    constructor(public http:Http) {
    }

    getData():Promise<SearchModel> {
        return this.http.get('./assets/example_data/lists.json')
            .toPromise()
            .then(response => response.json() as SearchModel)
            .catch(this.handleError);
    }

    private handleError(error:any):Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
