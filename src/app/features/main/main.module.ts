import { CommonModule, DecimalPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { BsModalService, ModalModule } from "ngx-bootstrap/modal";
import { NgxSpinnerModule } from "ngx-spinner";
import { MillionPipe } from "src/app/pipes/million-pipe";
import { BscScanProvider } from "src/app/providers/bscScan/bscScanProvider";
import { MainPageComponent } from "./main.page";

const routes: Routes = [
    {
        path: "",
        component: MainPageComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        NgbModule,
        ModalModule.forRoot(),
        NgxSpinnerModule
    ],
    declarations: [
        MainPageComponent,
        MillionPipe
    ],
    providers: [
        BsModalService,
        BscScanProvider,
        DecimalPipe
    ]
})
export class MainPageModule {

}
