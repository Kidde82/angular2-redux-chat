import "rxjs/add/operator/count";
import "rxjs/add/operator/map";
import { Injectable, Inject } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";

import { SessionStorageService } from "./session-storage.service";
import { User } from "../models";

@Injectable()
export class UserService {
	private apiUrl: string = "http://localhost:3001";

	constructor (
		private http: Http
	) {}

	getUsers(): Observable<User[]> {
		return this.http.get(this.apiUrl + "/api/v1/users")
		.map(res => res.json());
	}

	save(user: User): Observable<User> {
		if (!user.id) {
			user.id = this.getNextId();
		}

		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		console.log("savinguser");
		console.log(user);
		return this.http.post(this.apiUrl + "/api/v1/user", user, options)
				.map(this.extractData)
				.catch(this.handleError);

		// this.sessionStorageService.writeObject("currentUser", user);

		// this.store.dispatch(new collection.AddUserAction(user));
	}

	private getNextId(): string {
		return "1";
		// let nextId = "";
		// let count: Observable<number> = this.store.let(fromRoot.getUsersState).count(() => { return true;});
		// count.subscribe((x) => {
		// 	nextId = x.toString();
		// });
		// return nextId;
	}

	private extractData(res: Response) {
		let body = res.json();
		return body.data || { };
	}

	private handleError (error: Response | any) {
		// In a real world app, we might use a remote logging infrastructure
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}
}
