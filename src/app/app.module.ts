import { CommonModule, DecimalPipe } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule, Provider } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NGXS_STORAGE_PLUGIN_OPTIONS, STORAGE_ENGINE } from "@ngxs-labs/async-storage-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NGXS_PLUGINS, NgxsModule } from "@ngxs/store";
import { ToastrModule } from "ngx-toastr";
import { UiSwitchModule } from "ngx-toggle-switch";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomePageComponent } from "./features/home/home.page";
import { StoragePlugin } from "./ngxs-plugins/storage/storage.plugin";
import { MillionPipe } from "./pipes/million-pipe";
import { BinanceProvider } from "./providers/binance/binanceProvider";
import { BscScanProvider } from "./providers/bscScan/bscScanProvider";
import { CoinGeckoProvider } from "./providers/coinGecko/coinGeckoProvider";
import { PancakeSwapProvider } from "./providers/pancakeSwap/pancakeSwapProvider";
import { StorageProvider } from "./providers/storage/capacitor-storage.provider";
import { Web3Provider } from "./providers/web3/web3Provider";
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
        AppComponent,
        HomePageComponent,
        MillionPipe
    ],
    imports: [
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        BrowserModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ...NGXS_MODULES,
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        UiSwitchModule
    ],
    providers: [
        ...NGXS_PROVIDERS,
        BscScanProvider,
        BinanceProvider,
        CoinGeckoProvider,
        PancakeSwapProvider,
        Web3Provider,
        DecimalPipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
