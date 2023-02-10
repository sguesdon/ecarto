import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MenuModule} from 'primeng/menu';
import {CardModule} from 'primeng/card';
import {ToolbarModule} from 'primeng/toolbar';
import {FormsModule} from '@angular/forms';
import {ListboxModule} from 'primeng/listbox';
import {TreeSelectModule} from 'primeng/treeselect';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    CardModule,
    ToolbarModule,
    FormsModule,
    ListboxModule,
    TreeSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
