import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataApiService, GeoRefI } from 'src/app/shared/services/data-api.service';

@Component({
  selector: 'field-departament',
  templateUrl: './departament.component.html',
  styleUrls: ['./departament.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DepartamentComponent,
    multi: true
  }]
})
export class DepartamentComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Output() Output: EventEmitter<string> = new EventEmitter();
  @Input() province!: string;

  private _subs: Subscription[] = [];
  private _onChangeFunction!: Function;

  departaments!: GeoRefI[];
  filteredDepartament$!: Observable<GeoRefI[]>;
  departamentCtrl = new FormControl({ value: '', disabled: true });

  constructor(private readonly _dataApi: DataApiService) { }

  onChanged(departament: string): void {
    this._onChangeFunction(departament);
    this.Output.emit(departament);
  }

  registerOnChange(fn: any): void {
    this._onChangeFunction = fn;
  }

  writeValue(departament: string): void {
    this.departamentCtrl.setValue(departament);
  }

  registerOnTouched(fn: any): void { }

  ngOnChanges(changes: SimpleChanges): void {
    const province = changes['province'].currentValue;

    if (!province) {
      this.departamentCtrl.reset();
      this.departamentCtrl.disable();
      this.departaments = [];
    } else {
      const sub = this._dataApi.getDepartaments(province).subscribe(departaments => {
        if (departaments.length) {
          console.log('dep', departaments);

          this.departaments = departaments;
          this.departamentCtrl.enable();
          this.filteredDepartament$ = this.departamentCtrl.valueChanges.pipe(
            debounceTime(300),
            startWith(''),
            map(value => (this._filterDepartaments(value))),
          );
        }
      });

      this._subs.push(sub);
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { this._subs.forEach(s => s.unsubscribe()); }

  private _filterDepartaments(value: string): GeoRefI[] {
    const filterValue = value?.toLowerCase();

    return this.departaments.filter(dptos => dptos.nombre.toLowerCase().includes(filterValue));
  }

}
