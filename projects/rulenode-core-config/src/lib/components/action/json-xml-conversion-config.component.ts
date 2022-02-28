import { Component, ViewChild } from "@angular/core";
import { AppState, NodeScriptTestService } from "@core/public-api";
import {
  JsFuncComponent,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
} from "@shared/public-api";
import { Store } from "@ngrx/store";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "tb-action-node-json-xml-conversion-config",
  templateUrl: "./json-xml-conversion-config.component.html",
  styleUrls: [],
})
export class JsonXmlConversionConfigComponent extends RuleNodeConfigurationComponent {
  @ViewChild("jsFuncComponent", { static: true })
  jsFuncComponent: JsFuncComponent;

  jsonXmlConversionConfigForm: FormGroup;
  direction: any[] = [
    { key: "json转xml", value: "JSON_TO_XML" },
    { key: "xml转json", value: "XML_TO_JSON" },
  ];
  constructor(protected store: Store<AppState>, private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.jsonXmlConversionConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.jsonXmlConversionConfigForm = this.fb.group({
      direction: [configuration ? configuration.direction : null, []],
    });
  }
}
