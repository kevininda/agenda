import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataApiService, GeoRefI } from 'src/app/shared/services/data-api.service';

@Component({
  selector: 'field-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: LocationComponent,
    multi: true
  }]
})
export class LocationComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Output() Output: EventEmitter<string> = new EventEmitter();
  @Input() departament!: string;

  private _subs: Subscription[] = [];
  private _onChangeFunction!: Function;

  locations!: GeoRefI[];
  filteredlocations$!: Observable<GeoRefI[]>;
  locationCtrl = new FormControl();

  constructor(private readonly _dataApi: DataApiService) { }

  ngOnInit(): void {
  }

  onChanged(location: string): void {
    this._onChangeFunction(location);
    const geo: { lat: number, lon: number } | undefined = this.locations.find(loc => loc.nombre == location)?.geo;
    if (geo) this.Output.emit(JSON.stringify(geo));
  }

  registerOnChange(fn: any): void {
    this._onChangeFunction = fn;
  }

  writeValue(location: string): void {
    this.locationCtrl.setValue(location);
  }

  registerOnTouched(fn: any): void { }

  ngOnChanges(changes: SimpleChanges): void {
    const departament = changes['departament'].currentValue;

    if (!departament) {
      this.locationCtrl.reset();
      this.locationCtrl.disable();
      this.locations = [];
    } else {
      const sub = this._dataApi.getLocalidades(departament).subscribe(locations => {
        if (locations.length) {
          console.log('loc', locations);

          this.locations = locations;
          this.locationCtrl.enable();
          this.filteredlocations$ = this.locationCtrl.valueChanges.pipe(
            debounceTime(300),
            startWith(''),
            map(value => this._filterLocations(value)),
          );
        }
      });

      this._subs.push(sub);
    }
  }

  ngOnDestroy(): void { this._subs.forEach(s => s.unsubscribe()); }

  private _filterLocations(value: string): GeoRefI[] {
    const filterValue = value?.toLowerCase();

    return this.locations.filter(locs => locs.nombre.toLowerCase().includes(filterValue));
  }

}
