import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/entity/Category';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { CategoryService } from 'src/app/service/category.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  categoryForm: FormGroup;

  category: Category;

  // category id
  id: number;

  constructor(private categoryService: CategoryService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {

  }

  // initial values
  ngOnInit(): void {

    this.categoryForm = this.formBuilder.group({

      // initial values for fields
      id: [''],
      name: [''],

      // initial empty value to the status, and disable it
      status: [{ value: '', disabled: true }]

    });

    // get category id from params of the active route.
    // and then get category based on category id from database
    this.activatedRoute.paramMap.subscribe(

      (params: ParamMap) => {

        // get id from param of active route.
        // ex: http://localhost:4200/category-view/:id
        // ex: http://localhost:4200/category-view/3
        // the sign "+": use to convert from string to number
        this.id = +params.get('id');

        // get category by category id
        this.categoryService.findById(this.id).subscribe(

          // if there is no error when get data from database
          (data: Category) => {

            this.category = data;

            // load category information to the categoryForm
            this.categoryForm.patchValue(data);

          },

          // if there is error when get data from database
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
          
        );
      } // end of (params: ParamMap)
    ); // end of this.activatedRoute.paramMap.subscribe()

  } // end of ngOnInit()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "CategoryViewComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
