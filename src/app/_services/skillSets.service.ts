import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../app.config';
import { SkillSets } from '../_models/SkillSets';

@Injectable()
export class SkillSetsService {
    option: any = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    constructor(private http: HttpClient) { }

    getAllSkillSets() {
        return this.http.get<SkillSets[]>(appConfig.apiUrl + '/skillSets/getAllSkillSets');
    }

    getSkillSetsByType(type : string) {

        return this.http.get<SkillSets[]>(appConfig.apiUrl + '/skillSets/getAllSkillSetsByType?type='+type);
    }

    getSkillSetsByID(_id : string) {
        return this.http.get<SkillSets>(appConfig.apiUrl + '/skillSets/getAllSkillSetsByIdFromDB?_id='+_id);
    }

    getSkillSetsByName(skillName : string) {
        return this.http.get<SkillSets>(appConfig.apiUrl + '/skillSets/getSkillSetByName?skillName='+skillName);
    }

    postNewSkillSet(skillSet : SkillSets){
        console.log("in postNewSkillSet at client side : "+JSON.stringify(skillSet));
        return this.http.post<SkillSets>(appConfig.apiUrl + '/skillSets/createNewSkillSet',skillSet);
    }
    updateSkillSetObjectToDB(reqObj: Object){
        ////debugger;
        return this.http.put(appConfig.apiUrl + '/skillSets/updateSkillSet' , reqObj);
    }
    deleteSkillSet(_id: string) {
        //debugger;
        return this.http.delete(appConfig.apiUrl + '/skillSets/deleteSkillSet?id=' + _id);
    }

    GetSkillSetsByPanel(_id : string) {
        return this.http.get<any>(appConfig.apiUrl + '/skillSets/GetSkillSetByPanel?_id='+_id);
    }

}
