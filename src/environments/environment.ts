// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { STORAGE_KEYS } from "./storage-keys";

export const environment = {
    production: false,
    stateStorageKeys: STORAGE_KEYS,
    bscScanApiKey: "D82WTQMKMFJ6WDQYYJCPJC4RI4CEWQXNYM",
    // bscScanBnbApiKey: "KSPE45B1QQ5EQXRV2KXXJ5UDQPI23747DJ",
    simpContractAddress: "0xd0accf05878cafe24ff8b3f82f194c62ed755707"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
