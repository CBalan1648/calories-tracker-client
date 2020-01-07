import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';


interface StrategyParameter {
    retryAttemps?: number;
    exponentialBackoffDelay?: number;
    excludedStatusCodes?: number[];
}

export const requestRetryStrategy = ({ retryAttemps = 3, exponentialBackoffDelay = 1000, excludedStatusCodes = [400, 401, 403, 404] }:
    StrategyParameter = {}) => (attempts: Observable<any>) => {
        return attempts.pipe(
            mergeMap((error, i) => {
                const retryAttemp = i + 1;
                if (retryAttemp > retryAttemps || excludedStatusCodes.find(e => e === error.status)) {
                    return throwError(error);
                }
                return timer(retryAttemp * exponentialBackoffDelay);
            }),
            finalize(() => {})
        );
    };

