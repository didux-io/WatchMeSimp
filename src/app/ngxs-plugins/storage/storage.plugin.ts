/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, Inject } from "@angular/core";
import { NgxsPlugin, NgxsNextPluginFn, actionMatcher, InitState, UpdateState, getValue, setValue } from "@ngxs/store";
import { tap, concatMap, reduce, map } from "rxjs/operators";
import { Observable, of, from } from "rxjs";
import {
    NGXS_STORAGE_PLUGIN_OPTIONS,
    STORAGE_ENGINE,
    NgxsStoragePluginOptions,
    StorageEngine,
    AsyncStorageEngine,
    AsyncStorageEngineProxy
} from "@ngxs-labs/async-storage-plugin";

@Injectable()
export class StoragePlugin implements NgxsPlugin {
    private asyncStorageEngine: AsyncStorageEngine;

    constructor(
        @Inject(NGXS_STORAGE_PLUGIN_OPTIONS) private pluginOptions: NgxsStoragePluginOptions,
        @Inject(STORAGE_ENGINE) private storageEngine: StorageEngine | AsyncStorageEngine
    ) {
        if (typeof this.storageEngine.length === "function") {
            this.asyncStorageEngine = this.storageEngine as AsyncStorageEngine;
        } else {
            this.asyncStorageEngine = new AsyncStorageEngineProxy(this.storageEngine as StorageEngine);
        }
    }

    handle(state: any, event: any, next: NgxsNextPluginFn) {
        const options = this.pluginOptions || {};
        const matches = actionMatcher(event);
        const isInitAction = matches(InitState) || matches(UpdateState);
        const keys: any[] = Array.isArray(options.key) ? options.key : [options.key];
        let hasMigration = false;
        let initAction: Observable<void> = of(state);

        if (isInitAction) {
            initAction = from(keys).pipe(
                concatMap(key => this.asyncStorageEngine.getItem((key as any).key || key).pipe(map(val => [key, val]))),
                reduce((previousState, [key, val]) => {
                    const isMaster = key === "@@STATE";
                    let nextState = previousState;
                    if (val !== "undefined" && typeof val !== "undefined" && val !== null) {
                        try {
                            val = options.deserialize(val);
                        } catch (e) {
                            console.error("Error ocurred while deserializing the store value, falling back to empty object.", e);
                            val = {};
                        }

                        if (options.migrations) {
                            options.migrations.forEach(strategy => {
                                const versionMatch = strategy.version === getValue(val, strategy.versionKey || "version");
                                const keyMatch = (!strategy.key && isMaster) || strategy.key === key;
                                if (versionMatch && keyMatch) {
                                    val = strategy.migrate(val);
                                    hasMigration = true;
                                }
                            });
                        }
                        if (!isMaster) {
                            nextState = setValue(previousState, key.key || key, val);
                        } else {
                            nextState = { ...previousState, ...val };
                        }
                    }
                    return nextState;
                }, state),
            );
        }

        return initAction.pipe(
            concatMap(stateAfterInit => next(stateAfterInit, event)),
            tap(async nextState => {
                if (!isInitAction || (isInitAction && hasMigration)) {
                    for (let key of keys) {
                        let val = nextState as any;

                        if (key !== "@@STATE") {
                            if (!key || typeof(key) === "string") {
                                val = await getValue(nextState, key);
                            } else {
                                const subKeys = key.subKeys;
                                key = key.key;
                                val = await getValue(nextState, key);

                                const filtered = [];
                                for (const element of val) {
                                    const obj = {};

                                    for (const subKey of subKeys) {
                                        obj[subKey] = element[subKey];
                                    }

                                    filtered.push(obj);
                                }

                                val = filtered;
                            }
                        }

                        try {
                            this.asyncStorageEngine.setItem(key, options.serialize(val));
                        } catch (e) {
                            console.error("Error ocurred while serializing the store value, value not updated.", e);
                        }
                    }
                }
            })
        );
    }
}
