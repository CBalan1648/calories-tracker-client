import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppDeclarations, AppImports, EntryComponents } from './app.imports';
import { JwtInterceptor } from './helpers/jwt.interceptor';

@NgModule({
  declarations: AppDeclarations,
  imports: AppImports,
  bootstrap: [AppComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }],
  entryComponents: EntryComponents
})

export class AppModule { }
