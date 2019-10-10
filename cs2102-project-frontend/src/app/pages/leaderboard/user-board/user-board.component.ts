import { Component, OnInit } from '@angular/core';
import { PledgeService } from '../../../services/pledge.service';

@Component({
  selector: 'app-user-board',
  templateUrl: './user-board.component.html',
  styleUrls: ['./user-board.component.scss']
})
export class UserBoardComponent implements OnInit {

  leaderboard: any = []

  constructor(private pledgeService: PledgeService) { }

  ngOnInit() {
    this.fetchLeaderboard()
  }

  async fetchLeaderboard() {
    this.leaderboard = await this.pledgeService.getPledgeLeaderBoard()
  }

}
