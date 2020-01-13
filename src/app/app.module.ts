import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppDeclarations, AppImports, EntryComponents } from './app.imports';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { CacheInterceptor } from './helpers/cache.interceptor';

@NgModule({
  declarations: AppDeclarations,
  imports: AppImports,
  bootstrap: [AppComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CacheInterceptor,
    multi: true
  }],
  entryComponents: EntryComponents
})

export class AppModule { }
