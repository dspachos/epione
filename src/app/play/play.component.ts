import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {
  vpid: number;
  choice: number;
  entry: any;
  sub: any;
    nodes: Array<any>;
    pathway: Array<any> = [];
    node: Array<any>;
    progress: number;
    content: any;
    pathwaym: any;
  closeResult: string;


  constructor(
  private modalService: NgbModal,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  goToAction() {
    this.node = this.nodes.find(item => item.id === this.choice);
    this.choice = null;
    // tslint:disable-next-line:max-line-length
    this.pathway[this.pathway.length - 1].timenode = (Math.floor(Date.now()) - this.pathway[this.pathway.length - 1].timestamp) / 1000;
    this.node['timestamp'] = Math.floor(Date.now());
    this.pathway.push(this.node); // push the node in the pathway
    window.scroll(0, 0);
  }

  onSelectionChange(entry: any) {
    this.choice = entry;
  }


  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      console.log({params});
      this.vpid = parseInt(params['vpid']);
    });

    const vpsrc = 'assets/vps/' + this.vpid + '/data.json';
    this.sub = this.http.get(vpsrc)
      .subscribe(data => {
        // Read the result field from the JSON response.
        this.nodes = data['nodes'];
        this.node = data['nodes'][0];
        this.node['timestamp'] = Math.floor(Date.now());
        this.pathway.push(this.node); // push the node in the pathway
      });
  }

 ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openp(pathwaym: any) {
      this.modalService.open(pathwaym).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  open(content: any) {
      // console.log(this.node);
      this.modalService.open(content).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }
    }


  } // end class

