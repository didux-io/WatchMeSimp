import { Observable, of } from "rxjs";
import { AsyncStorageEngine } from "@ngxs-labs/async-storage-plugin";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class StorageProvider implements AsyncStorageEngine {
    length(): Observable<number> {
        return of(localStorage.length);
    }

    getItem(key: string): Observable<string> {
        return of(localStorage.getItem(key));
    }

    setItem(key: string, val: string): Observable<void> {
        return of(localStorage.setItem(key, val));
    }

    removeItem(key: string): Observable<void> {
        return of(localStorage.removeItem(key));
    }

    clear(): Observable<void> {
        return of(localStorage.clear());
    }

    key(): Observable<string> {
        throw new Error("Method not implemented.");
    }
}
