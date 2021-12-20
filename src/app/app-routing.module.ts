import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomePageComponent } from "./features/home/home.page";
import { MainPageComponent } from "./features/main/main.page";

const routes: Routes = [
    {
        path: "",
        component: HomePageComponent
    }, {
        path: ":address",
        component: HomePageComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
