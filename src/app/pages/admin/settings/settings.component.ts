import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { SettingsService, Multipliers } from "./settings.service";

@Component({
  selector: "app-admin-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  public loading: boolean = false;
  public saved: boolean = false;
  public applied: boolean = false;
  public multipliersForm = new FormGroup({
    xlob: new FormControl(1.0, [Validators.required, Validators.min(0)]),
    andra: new FormControl(1.0, [Validators.required, Validators.min(0)]),
    najs: new FormControl(1.0, [Validators.required, Validators.min(0)])
  });

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsService.getMultipliers()
      .subscribe((m: Multipliers) => {
        this.multipliersForm.setValue({ xlob: m.xlob, andra: m.andra, najs: m.najs });
      });
  }

  save() {
    if (this.multipliersForm.valid && !this.loading) {
      this.loading = true;
      this.saved = false;
      this.settingsService.updateMultipliers(this.multipliersForm.value)
        .subscribe(() => {
          this.loading = false;
          this.saved = true;
        });
    }
  }

  applyToAll() {
    if (this.multipliersForm.valid && !this.loading) {
      this.loading = true;
      this.applied = false;
      this.settingsService.applyMultipliers(this.multipliersForm.value)
        .subscribe(() => {
          this.loading = false;
          this.applied = true;
        });
    }
  }
}
