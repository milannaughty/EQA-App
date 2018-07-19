import { Component, OnInit } from '@angular/core';
import { SkillSetsService } from '../_services/index';
import { SkillSets } from '../_models';
// import { PaginationModule  } from 'ngx-pagination-bootstrap';
@Component({
  selector: 'app-admin-skill-set',
  templateUrl: './admin-skill-set.component.html',
  styleUrls: ['./admin-skill-set.component.css']
})
export class AdminSkillSetComponent implements OnInit {

  model:any={};
  skillSets : any;
  skillTypeList: { "Id": string; "Name": string; }[];

  constructor( private skillSetsService: SkillSetsService) { }

  ngOnInit() {
    debugger;
    this.skillSetsService.getAllSkillSets().subscribe(
                    devSkills =>{
                      //debugger;
                      this.skillSets=(devSkills as SkillSets[]);
                      //console.log(this.skillSets);
                      // .map(x=>({id:x["_id"],itemName:x["skillName"]}));
                      // this.skillList=this.skillList.sort((x, y) => x.itemName.localeCompare(y.itemName));
                      }
                  )
  this.skillTypeList = [
                    {
                        "Id": 'Dev',
                        "Name": "Dev"
                    },
                    {
                        "Id": 'QA',
                        "Name": "QA"
                    }]                  
  }

  addNewSkill(newSkillName){
debugger;
this.skillSetsService.postNewSkillSet(newSkillName).subscribe(
  result => {
      debugger;
      console.log(result);
  }
)

  }

}
