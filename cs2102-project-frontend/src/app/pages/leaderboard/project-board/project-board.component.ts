import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.scss']
})
export class ProjectBoardComponent implements OnInit {

  constructor(private projectService: ProjectService, private router: Router) { }

  public leaderboard: any = [];

  ngOnInit() {
    this.fetchLeaderBoard();
  }


  async fetchLeaderBoard() {
    this.leaderboard = await this.projectService.fetchLeaderBoard();
    console.log(this.leaderboard)
  }

  viewProject(projectId: number) {
    this.router.navigate([`/main/project/${projectId}`]);
  }


}
