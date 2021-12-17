import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "./features/base-component/base-component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent extends BaseComponent {

    constructor(
        private translate: TranslateService
    ) {
        super();
        this.translate.setDefaultLang("nl");
    }
}
