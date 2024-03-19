import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './services/api.interceptor';
import { CustomersComponent } from './main/customers/customers.component';
import { ModalComponent } from './main/modal/modal.component';
import { CeilPipe } from './utils/pipes/ceil.pipe';
import { FormatDatePipe } from './utils/pipes/format-date.pipe';
import { NavbarComponent } from './main/navbar/navbar.component';
import { FooterComponent } from './main/footer/footer.component';
import { SortIconComponent } from './main/sort-icon/sort-icon.component';
import { SearchComponent } from './main/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    CustomersComponent,
    ModalComponent,
    CeilPipe,
    FormatDatePipe,
    NavbarComponent,
    FooterComponent,
    SortIconComponent,
    SearchComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
