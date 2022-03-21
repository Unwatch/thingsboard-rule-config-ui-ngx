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
  selector: "tb-action-node-scheduled-task-config",
  templateUrl: "./scheduled-task-config.component.html",
  styleUrls: [],
})
export class ScheduledTaskConfigComponent extends RuleNodeConfigurationComponent {
  @ViewChild("jsFuncComponent", { static: true })
  jsFuncComponent: JsFuncComponent;

  scheduledTaskConfigForm: FormGroup;

  constructor(
    protected store: Store<AppState>,
    private fb: FormBuilder,
    private nodeScriptTestService: NodeScriptTestService,
    private translate: TranslateService
  ) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.scheduledTaskConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.scheduledTaskConfigForm = this.fb.group({
      msgCount: [
        configuration ? configuration.msgCount : null,
        [Validators.required, Validators.min(0)],
      ],
      // periodInSeconds: [configuration ? configuration.periodInSeconds : null, [Validators.required, Validators.min(1)]],
      originator: [configuration ? configuration.originator : null, []],
      jsScript: [
        configuration ? configuration.jsScript : null,
        [Validators.required],
      ],
      cron: [configuration ? configuration.cron : null, [Validators.required]],
    });
  }

  protected prepareInputConfig(
    configuration: RuleNodeConfiguration
  ): RuleNodeConfiguration {
    if (configuration) {
      if (configuration.originatorId && configuration.originatorType) {
        configuration.originator = {
          id: configuration.originatorId,
          entityType: configuration.originatorType,
        };
      } else {
        configuration.originator = null;
      }
      delete configuration.originatorId;
      delete configuration.originatorType;
    }
    return configuration;
  }

  protected prepareOutputConfig(
    configuration: RuleNodeConfiguration
  ): RuleNodeConfiguration {
    if (configuration.originator) {
      configuration.originatorId = configuration.originator.id;
      configuration.originatorType = configuration.originator.entityType;
    } else {
      configuration.originatorId = null;
      configuration.originatorType = null;
    }
    delete configuration.originator;
    return configuration;
  }

  testScript() {
    const script: string = this.scheduledTaskConfigForm.get("jsScript").value;
    this.nodeScriptTestService
      .testNodeScript(
        script,
        "generate",
        this.translate.instant("tb.rulenode.generator"),
        "Generate",
        ["prevMsg", "prevMetadata", "prevMsgType"],
        this.ruleNodeId,
        "rulenode/generator_node_script_fn"
      )
      .subscribe((theScript) => {
        if (theScript) {
          this.scheduledTaskConfigForm.get("jsScript").setValue(theScript);
        }
      });
  }

  protected onValidate() {
    this.jsFuncComponent.validateOnSubmit();
  }
}
