import { Component, OnInit } from '@angular/core';

import { ServersService } from '../servers.service';

import { ActivatedRoute,Params,Router} from '@angular/router';

import { CanComponentDeactivate } from "./can-deactivate-guard.service";

import { Observable } from "rxjs/Observable";
@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: {id: number, name: string, status: string};
  serverId;
  serverName = '';
  serverStatus = '';
  allowedEdit = false;
  changesSaved = false;

  constructor(private route : ActivatedRoute,private serversService: ServersService,private router:Router){ }

  ngOnInit() {
    // console.log(this.route.snapshot.queryParams);
    // console.log(this.route.snapshot.fragment);

    this.route.queryParams.subscribe(
      (queryparams : Params)=>{
        this.allowedEdit = queryparams['allowEdit'] === '1' ? true : false;
      }
    );
    this.route.fragment.subscribe();

    this.route.params
        .subscribe(
          (params:Params) => {
            this.serverId = params['id'];
          }
        )
  


    // this.route.params.subscribe((params:Params)=>this.serverId = params['id'])
    this.server = this.serversService.getServer(this.serverId);
    console.log(this.server);
    console.log(this.serverId);
    // this.server.id = this.server.id;
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'],{relativeTo:this.route});
 }

 canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
   if(!this.allowedEdit){
     return true;
   }

   if((this.serverName !== this.server.name || this.serverStatus !== this.server.status) && !this.changesSaved ){
      return confirm('Do you want to discard the changes?');
   } else {
     return true;
   }

 } 

}
