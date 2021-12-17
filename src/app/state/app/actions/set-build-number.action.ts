export class SetBuildNumber {
    static readonly type = "[App] SetBuildNumber";

    constructor(public buildNumber: number) {}
}
