import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export interface GeoRefI {
  nombre: string
  geo: { lat: number, lon: number }
}

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  constructor(private readonly _http: HttpClient) { }

  baseURL: string = 'https://apis.datos.gob.ar/georef/api';

  getProvincias(): Observable<GeoRefI[]> {
    return this._http.get<any>(`${this.baseURL}/provincias?&campos=nombre`)
      .pipe(map(provs => (provs.provincias.map((prov: any) => ({ nombre: prov.nombre })))));
  }

  getDepartaments(prov: string): Observable<GeoRefI[]> {
    return this._http.get<any>(`${this.baseURL}/departamentos?provincia=${prov}&campos=nombre&max=1000`).pipe(
      map(dptos => (dptos.departamentos.map((dpto: any) => ({ nombre: dpto.nombre }))))
    );
  }

  getLocalidades(dpto: string): Observable<GeoRefI[]> {
    return this._http.get<any>(`${this.baseURL}/localidades-censales?departamento=${dpto}&campos=nombre,centroide&max=1000`)
      .pipe(
        map(locs => (locs.localidades_censales.map((loc: any) => {
          return {
            nombre: loc.nombre,
            geo: {
              lat: loc.centroide.lat,
              lon: loc.centroide.lon
            }
          }
        })))
      );
  }
}
