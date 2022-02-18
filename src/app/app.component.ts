import {
  Component,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  answers = [
    { type: 'yes', text: 'Yes' },
    { type: 'no', text: 'No' },
  ];
  defaultAnswer = 'no';
  defaultCountry = 'ua';

  form!: FormGroup;
  ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormGroup({
        username: new FormControl('ss', [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(3),
          Validators.pattern('[a-zA-Z]*'),
        ]),
        age: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{2}'),
          this.checkForAge,
        ]),
        email: new FormControl(
          'test1@ukr.net',
          [Validators.required, Validators.email],
          this.checkForEmail()
        ),
        pass: new FormControl('', [
          Validators.required,
          this.checkForLength.bind(this),
        ]),
      }),
      phones: new FormArray([
        new FormControl('380', [
          Validators.required,
          Validators.pattern('[0-9]{12}'),
        ]),
      ]),
      country: new FormControl('ua'),
      answer: new FormControl('no', [this.checkForAnswer]),
    });

    this.form.valueChanges.subscribe((value) => {
      console.log(value);
      return (this.value = value);
    });
  }
  value: any;
  onSubmit() {
    console.log('Submitted', this.form.status, this.form);
  }
  getFormsControls(): FormArray {
    return this.form.controls['phones'] as FormArray;
  }

  addPhone() {
    console.log(this.form.controls['phones'].value);
    return (<FormArray>this.form.controls['phones']).push(
      new FormControl('380', [
        Validators.required,
        Validators.pattern('[0-9]{12}'),
      ])
    );
  }

  deletePhone() {
    let length = this.form.controls['phones'].value.length;
    if (length > 1) {
      return (<FormArray>this.form.controls['phones']).removeAt(length - 1);
    }
  }
  charsCount = 5;

  checkForLength(control: FormControl) {
    console.log(control, 'ErrorLength');
    if (control.value.length <= this.charsCount) {
      return {
        lengthError: true,
      };
    } else {
      return null;
    }
    // obj {'errorCode': true} or null || undefined
  }

  checkForAge(control: AbstractControl) {
    console.log(control, 'ErrorAge');
    if (control.value < 18 || control.value > 100) {
      return {
        ageError: true,
      };
    } else {
      return null;
    }
    // obj {'errorCode': true} or null || undefined
  }

  checkForAnswer(control: AbstractControl) {
    console.log(control, 'ErrorAnswer');
    if (control.value == 'no') {
      return {
        answerError: true,
      };
    } else {
      return null;
    }
    // obj {'errorCode': true} or null || undefined
  }

  checkForEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<any> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (control.value === 'test1@ukr.net') {
            resolve({
              emailIsUsed: true,
            });
          } else {
            resolve(null);
          }
        }, 1000);
      });
    };
  }

  // TD approach
  // @ViewChild('form') form!: NgForm;
  // answers = [
  //   { type: 'yes', text: 'Да' },
  //   { type: 'no', text: 'нет' },
  // ];
  // defaultAnswer = 'yes';
  // defaultCountry = 'ua';
  // formData = {};
  // isSubmited = false;
  // addRandEmail() {
  //   const randEmail = 'test@tst.com';
  //   // console.log(this.form);
  //   // this.form.setValue({
  //   //   user: {
  //   //     pass: '',
  //   //     email: randEmail,
  //   //   },
  //   //   country: '',
  //   //   answer: '',
  //   // });
  //   this.form.form.patchValue({
  //     user: {
  //       email: randEmail,
  //     },
  //   });
  // }
  // submitForm(form: NgForm) {
  //   this.isSubmited = true;
  //   console.log(form);
  //   console.log('Submitted');
  //   console.log(form.value);
  //   this.formData = this.form.value;
  //   this.form.reset();
  // }
}
