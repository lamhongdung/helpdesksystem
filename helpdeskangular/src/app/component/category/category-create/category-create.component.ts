import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/entity/Category';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { CategoryService } from 'src/app/service/category.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent {

 // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  categoryForm: FormGroup;

  category: Category;

  errorMessages = {
    name: [
      { type: 'required', message: 'Please input category name' },
      { type: 'maxlength', message: 'Name cannot be longer than 50 characters' }
    ]
  };

  constructor(private router: Router,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) { }

  // this method ngOnInit() is run after the component "CategoryCreateComponent" is contructed
  ngOnInit(): void {

    // initial form
    this.categoryForm = this.formBuilder.group({

      // required and max length = 50 characters
      name: ['', [Validators.required, Validators.maxLength(50)]],

      // initial value = 'Active'
      status: ['Active']
    });

  } // end of ngOnInit()

  // create category.
  // when user clicks the "Save" button in the "Create category" screen
  createCategory() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // create category
      this.categoryService.createCategory(this.categoryForm.value).subscribe(

        // create category successful
        (data: Category) => {

          this.category = data;

          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, `Category '${data.name}' is created successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // navigate to the "category-list" page
          this.router.navigateByUrl("/category-list");
        },

        // create category failure
        (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      )
    );

  } // end of createCategory()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "CategoryCreateComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the CategoryCreateComponent class
