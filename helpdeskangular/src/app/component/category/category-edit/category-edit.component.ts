import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/payload/Category';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { CategoryService } from 'src/app/service/category.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  categoryForm: FormGroup;

  category: Category;

  // category id
  id: number;

  // error messages
  errorMessages = {
    name: [
      { type: 'required', message: 'Please input category name' },
      { type: 'maxlength', message: 'Category name cannot be longer than 50 characters' }
    ]
  };

  constructor(private router: Router,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {

  }

  // initial values
  ngOnInit(): void {

    this.categoryForm = this.formBuilder.group({

      // do not need validate id because this "id" field is read only
      id: [''],

      name: ['', [Validators.required, Validators.maxLength(50)]],
      status: ['']
    });

    // get category id from params of the active route(from address path).
    // and then get category based on category id from database
    this.activatedRoute.paramMap.subscribe(

      (params: ParamMap) => {

        // get id from param of active route.
        // The "+"" sign: convert string to number. 
        this.id = +params.get('id');

        // get category by category id
        this.categoryService.findById(this.id).subscribe({

          // get category from database
          next: (data: Category) => {

            this.category = data;

            // load category information to the categoryForm
            this.categoryForm.patchValue(data);

          },

          // there is error when get category from database
          error: (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        });
      });

  } // end of ngOnInit()

  // edit category.
  // when user clicks the "Save" button in the "Edit category"
  editCategory() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push the subscribe to a list of subscriptions in order to easily unsubscribe them when destroy the component
    this.subscriptions.push(

      // edit exsting category
      this.categoryService.editCategory(this.categoryForm.value).subscribe({

        // update category successful
        next: (data: Category) => {

          this.category = data;

          // send notification to user
          this.sendNotification(NotificationType.SUCCESS, `Category '${data.name}' is updated successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // after update category successful then navigate to the "category-list" page
          this.router.navigateByUrl("/category-list");
        },

        // there are some errors when update category
        error: (errorResponse: HttpErrorResponse) => {

          // send failure message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })
    );

  } // end of editCategory()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "CategoryEditComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the CategoryEditComponent
