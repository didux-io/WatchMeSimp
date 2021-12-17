import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Pipe({
    name: "safeHtmlImage"
})
export class SafeHtmlPipeImage implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpeg;base64,${value}`);
    }
}
