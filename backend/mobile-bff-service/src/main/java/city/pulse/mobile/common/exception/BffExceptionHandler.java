package city.pulse.mobile.common.exception;

import city.pulse.common.exception.ErrorResponse;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class BffExceptionHandler {
    @ExceptionHandler(DownstreamBusinessException.class)
    public ResponseEntity<ErrorResponse> handleDownstreamBusinessException(DownstreamBusinessException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ex.getErrorResponse());
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeignInfrastructureException(FeignException ex) {
        log.error("Infrastructure/Network error while calling downstream service: {}", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ErrorResponse.of(HttpStatus.SERVICE_UNAVAILABLE, "Service is currently unavailable. Please try again later."));
    }
}
