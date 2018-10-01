import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../app.config';
import{Area} from '../_models/Area';


@Injectable()
export class AreaServices
{
    option: any = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    constructor(private http: HttpClient) { }

    getAllArea() {
        return this.http.get<Area[]>(appConfig.apiUrl + '/area/getAllArea');
    }
    postNewArea(addArea:string){
        return this.http.post<Area[]>(appConfig.apiUrl+'/area/createNewArea',addArea);
    }
    getAreaByName(AreaName:string)
    {
        return this.http.get<Area[]>(appConfig.apiUrl+'/area/getAreaByName'+AreaName);
    }
    getAreaById(_id:string)
    {
        return this.http.get<Area[]>(appConfig.apiUrl+'/area/getAreaById'+_id);
    }

    updateAreaToDb(reqObj: Object)
    {
        return this.http.post<Area[]>(appConfig.apiUrl+'/area/updateArea',reqObj);
    }

    deleteArea(_id: string) {
        return this.http.delete(appConfig.apiUrl + '/area/deleteArea?id=' + _id);
    }

}