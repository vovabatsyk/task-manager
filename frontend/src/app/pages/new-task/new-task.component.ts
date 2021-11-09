import { Component, OnInit } from '@angular/core';
import {TaskService} from '../../task.service'
import {ActivatedRoute, Params, Router} from '@angular/router'
import {Task} from '../../models/task.model'
import {THIS_EXPR} from '@angular/compiler/src/output/output_ast'

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService:TaskService, private route: ActivatedRoute, private router: Router) { }

  // @ts-ignore
  listId: string

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId']
    })
  }

  createTask(title: string) {
    // @ts-ignore
    this.taskService.createTask(title, this.listId).subscribe((newTask: Task) => {
      this.router.navigate(['../'], {relativeTo: this.route})
    })
  }
}