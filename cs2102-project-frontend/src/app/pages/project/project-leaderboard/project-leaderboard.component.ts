import { Component, OnInit, Input } from '@angular/core';
import { PledgeService } from '../../../services/pledge.service';

@Component({
  selector: 'app-project-leaderboard',
  templateUrl: './project-leaderboard.component.html',
  styleUrls: ['./project-leaderboard.component.scss']
})
export class ProjectLeaderboardComponent implements OnInit {

  leaderboard: any;

  @Input() project;

  constructor(private pledgeService: PledgeService) { }

  ngOnInit() {
    this.fetchPledgeLeaderboard()
  }

  async fetchPledgeLeaderboard() {
    // Need to include current end day as well
    this.leaderboard = await this.pledgeService.getPledgeLeaderBoardByProject(this.project.id);
  }

}
