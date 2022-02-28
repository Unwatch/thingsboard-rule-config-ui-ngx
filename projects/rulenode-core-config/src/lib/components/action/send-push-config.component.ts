import { Component } from "@angular/core";
import { AppState } from "@core/public-api";
import {
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
} from "@shared/public-api";
import { Store } from "@ngrx/store";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "tb-action-node-send-push-config",
  templateUrl: "./send-push-config.component.html",
  styleUrls: [],
})
export class SendPushConfigComponent extends RuleNodeConfigurationComponent {
  sendPushConfigForm: FormGroup;

  constructor(protected store: Store<AppState>, private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.sendPushConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.sendPushConfigForm = this.fb.group({
      messageTitleTemplate: [
        configuration ? configuration.messageTitleTemplate : null,
        [Validators.required],
      ],
      pushMessageTemplate: [
        configuration ? configuration.pushMessageTemplate : null,
        [Validators.required],
      ],
      useSystemPushSettings: [
        configuration ? configuration.useSystemPushSettings : false,
        [],
      ],
      pushProviderConfiguration: [
        configuration ? configuration.pushProviderConfiguration : null,
        [],
      ],
    });
  }

  protected validatorTriggers(): string[] {
    return ["useSystemPushSettings"];
  }

  protected updateValidators(emitEvent: boolean) {
    const useSystemPushSettings: boolean = this.sendPushConfigForm.get(
      "useSystemPushSettings"
    ).value;
    if (useSystemPushSettings) {
      this.sendPushConfigForm
        .get("pushProviderConfiguration")
        .setValidators([]);
    } else {
      this.sendPushConfigForm
        .get("pushProviderConfiguration")
        .setValidators([Validators.required]);
    }
    this.sendPushConfigForm
      .get("pushProviderConfiguration")
      .updateValueAndValidity({ emitEvent });
  }
}
