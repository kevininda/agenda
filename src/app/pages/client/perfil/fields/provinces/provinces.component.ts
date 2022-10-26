import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, map, Observable, startWith, Subscription } from 'rxjs';
import { DataApiService, GeoRefI } from 'src/app/shared/services/data-api.service';

@Component({
  selector: 'field-provinces',
  templateUrl: './provinces.component.html',
  styleUrls: ['./provinces.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ProvincesComponent,
    multi: true
  }]
})
export class ProvincesComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Output() Output: EventEmitter<string> = new EventEmitter();

  private _subs: Subscription[] = [];
  private _onChangeFunction!: Function;

  provinces!: GeoRefI[];
  filteredProvinces$!: Observable<GeoRefI[]>;
  provinceCtrl = new FormControl();

  constructor(private readonly _dataApi: DataApiService) { }

  onChanged(province: string): void {
    this._onChangeFunction(province);
    this.Output.emit(province);
  }

  registerOnChange(fn: any): void {
    this._onChangeFunction = fn;
  }

  writeValue(province: string): void {
    this.provinceCtrl.setValue(province);
  }

  registerOnTouched(fn: any): void { }

  ngOnInit(): void {
    const sub = this._dataApi.getProvincias().subscribe(provinces => {
      if (provinces) {
        console.log(provinces);

        this.provinces = provinces;
        this.filteredProvinces$ = this.provinceCtrl.valueChanges.pipe(
          debounceTime(300),
          startWith(''),
          map(value => this._filterProvinces(value)),
        );
      }
    });

    this._subs.push(sub);
  }

  ngOnDestroy(): void { this._subs.forEach(s => s.unsubscribe()) }

  private _filterProvinces(value: string): GeoRefI[] {
    const filterValue = value?.toLowerCase();

    return this.provinces.filter(prov => prov.nombre.toLowerCase().includes(filterValue));
  }

}
