import { Component, Directive, Injectable, OnInit } from '@angular/core';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs'

@Directive({
  selector: 'app-websocket'
})

@Injectable()
export class WebsocketComponent implements OnInit {
 

  baseHttp=""

  notifications:any[]=[]
  changed=false;

  public connect(id:any,func:any) {
    let socket = new SockJs(this.baseHttp+`alexandru-websocket`);

    let stompClient = Stomp.over(socket);

    stompClient.connect({}, frame => {
			// Subscribe to notification topic
        console.log("WEB SOCKET id:"+id)
        stompClient.subscribe('/topic/note/'+id, notifications => {
        console.log("received notification")
				// Update notifications attribute with the recent messsage sent from the server
                this.notifications.push(frame)
                this.changed=true;
                func(this.notifications)

            })
        });


    return stompClient;
}

  constructor(private rclm:RuntimeConfigLoaderService) { this.baseHttp=this.rclm.getConfig()["local_server_ip_port"]}

  ngOnInit(): void {
    this.baseHttp=this.rclm.getConfig()["local_server_ip_port"]
  }

}
