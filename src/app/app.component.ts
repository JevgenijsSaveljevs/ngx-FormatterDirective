import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  disabled = false;
  title = 'formatting';
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      total: [{ value: 0, disabled: false }]
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      total: 99
    }, { emitEvent: false });


  }

  setdisabled() {
    this.disabled = !this.disabled;

    const ctrl = this.form.get('total');

    if (this.disabled) {
      ctrl.disable();
    } else {
      ctrl.enable();
    }

    console.log('isDirty', ctrl.dirty);
  }

  clearForm() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
