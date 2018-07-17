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

    postNewSkillSet(){
        return this.http.get<SkillSets>(appConfig.apiUrl + '/skillSets/createNewSkillSet');
    }

}
