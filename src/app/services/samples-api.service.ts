import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sample, FakeSamples } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class SamplesApiService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Sample[]> {
    if (environment.production) {
      return this.http
        .get<Sample[]>('/samples')
        .pipe(
          map((samples: Sample[]) =>
            samples.map(sample => this.parseData(sample))
          )
        );
    }
    return of(FakeSamples.map(sample => this.parseData(sample)));
  }

  getBetween(from: string, to: string): Observable<Sample[]> {
    if (environment.production) {
      return this.http.get<Sample[]>('/query_samples', {
        params: {
          from,
          to
        }
      });
    }
    return of(FakeSamples);
  }

  parseData(sample: Sample): Sample {
    return {
      ...sample,
      dateTime: new Date(sample.date_time)
    };
  }
}
