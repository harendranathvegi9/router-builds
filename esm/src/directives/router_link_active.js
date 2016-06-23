import { ContentChildren, Directive, ElementRef, Input, Renderer } from '@angular/core';
import { NavigationEnd, Router } from '../router';
import { containsTree } from '../url_tree';
import { RouterLink } from './router_link';
export class RouterLinkActive {
    /**
     * @internal
     */
    constructor(router, element, renderer) {
        this.router = router;
        this.element = element;
        this.renderer = renderer;
        this.classes = [];
        this.routerLinkActiveOptions = { exact: true };
        this.subscription = router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }
    ngAfterContentInit() {
        this.links.changes.subscribe(s => this.update());
        this.update();
    }
    set routerLinkActive(data) {
        if (Array.isArray(data)) {
            this.classes = data;
        }
        else {
            this.classes = data.split(' ');
        }
    }
    ngOnChanges(changes) { this.update(); }
    ngOnDestroy() { this.subscription.unsubscribe(); }
    update() {
        if (!this.links || this.links.length === 0)
            return;
        const currentUrlTree = this.router.parseUrl(this.router.url);
        const isActive = this.links.reduce((res, link) => res || containsTree(currentUrlTree, link.urlTree, this.routerLinkActiveOptions.exact), false);
        this.classes.forEach(c => this.renderer.setElementClass(this.element.nativeElement, c, isActive));
    }
}
/** @nocollapse */
RouterLinkActive.decorators = [
    { type: Directive, args: [{ selector: '[routerLinkActive]' },] },
];
/** @nocollapse */
RouterLinkActive.ctorParameters = [
    { type: Router, },
    { type: ElementRef, },
    { type: Renderer, },
];
/** @nocollapse */
RouterLinkActive.propDecorators = {
    'links': [{ type: ContentChildren, args: [RouterLink,] },],
    'routerLinkActiveOptions': [{ type: Input },],
    'routerLinkActive': [{ type: Input },],
};
//# sourceMappingURL=router_link_active.js.map