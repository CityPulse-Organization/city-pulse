package city.pulse.registration.exception;

import city.pulse.common.exception.ErrorResponse;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeignException(FeignException ex) {
        log.warn("Feign client exception: status {}, message {}", ex.status(), ex.getMessage());

        int status = ex.status() > 0 ? ex.status() : HttpStatus.INTERNAL_SERVER_ERROR.value();

        String message = "External service error";
        if (status == 409) {
            message = "User with this email or username already exists.";
        } else if (status == 400) {
            message = "Invalid data provided to external service.";
        }

        HttpStatus httpStatus = HttpStatus.resolve(status) != null 
                ? HttpStatus.valueOf(status) 
                : HttpStatus.INTERNAL_SERVER_ERROR;

        return ResponseEntity.status(httpStatus)
                .body(ErrorResponse.of(httpStatus, message));
    }
}
