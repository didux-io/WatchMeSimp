import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule, Provider } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NGXS_STORAGE_PLUGIN_OPTIONS, STORAGE_ENGINE } from "@ngxs-labs/async-storage-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NGXS_PLUGINS, NgxsModule } from "@ngxs/store";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ModalModule } from "ngx-bootstrap/modal";
import { PopoverModule } from "ngx-bootstrap/popover";
import { NgxSelectModule } from "ngx-select-ex";
import { ToastrModule } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { StoragePlugin } from "./ngxs-plugins/storage/storage.plugin";
import { StorageProvider } from "./providers/storage/capacitor-storage.provider";
import { UtilsProvider } from "./providers/utils/utils";
import { AppStateModule } from "./state/app/app.module";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}

const NGXS_MODULES = [
    NgxsModule.forRoot([], {
        developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxSelectModule,
    AppStateModule
];

const NGXS_PROVIDERS: Provider[] = [
    StoragePlugin,
    {
        provide: STORAGE_ENGINE,
        useClass: StorageProvider
    },
    {
        provide: NGXS_STORAGE_PLUGIN_OPTIONS,
        useValue: {
            key: environment.stateStorageKeys,
            serialize: JSON.stringify,
            deserialize: JSON.parse
        }
    },
    {
        provide: NGXS_PLUGINS,
        useClass: StoragePlugin,
        multi: true
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxSelectModule,
        AppRoutingModule,
        BrowserModule,
        ToastrModule.forRoot({}),
        NgbModule,
        FontAwesomeModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ...NGXS_MODULES,
        PopoverModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
    ],
    providers: [
        ...NGXS_PROVIDERS,
        UtilsProvider,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas, far);
    }
}
