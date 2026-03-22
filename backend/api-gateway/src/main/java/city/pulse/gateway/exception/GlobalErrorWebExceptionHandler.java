package city.pulse.gateway.exception;

import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.autoconfigure.web.reactive.error.AbstractErrorWebExceptionHandler;
import org.springframework.boot.web.reactive.error.ErrorAttributes;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.*;
import reactor.core.publisher.Mono;

import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;

@Slf4j
@Order(-1)
@Component
public class GlobalErrorWebExceptionHandler extends AbstractErrorWebExceptionHandler {
    public GlobalErrorWebExceptionHandler(ErrorAttributes errorAttributes, ApplicationContext applicationContext,
            ServerCodecConfigurer serverCodecConfigurer) {
        super(errorAttributes, new WebProperties().getResources(), applicationContext);
        super.setMessageWriters(serverCodecConfigurer.getWriters());
        super.setMessageReaders(serverCodecConfigurer.getReaders());
    }

    @Override
    protected RouterFunction<ServerResponse> getRoutingFunction(ErrorAttributes errorAttributes) {
        return RouterFunctions.route(RequestPredicates.all(), this::renderErrorResponse);
    }

    private Mono<ServerResponse> renderErrorResponse(ServerRequest request) {
        var error = getError(request);
        var status = determineHttpStatus(error);

        var message = error.getMessage() != null ? error.getMessage() : "Unknown error occurred";

        if (status == HttpStatus.SERVICE_UNAVAILABLE || status == HttpStatus.GATEWAY_TIMEOUT) {
            log.warn("Gateway error (path: {}): [{}] {}", request.path(), status.value(), message);
            message = "Service is temporarily unavailable or unreachable. Please try again later.";
        } else {
            log.error("Internal Gateway error (path: {}): [{}]", request.path(), status.value(), error);
        }

        var responseBody = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                null);

        return ServerResponse.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(responseBody));
    }

    private HttpStatus determineHttpStatus(Throwable error) {
        var cause = error;
        while (cause != null) {
            if (cause instanceof java.net.ConnectException ||
                    cause instanceof java.net.UnknownHostException ||
                    cause.getClass().getName().contains("ConnectException") ||
                    cause instanceof org.springframework.cloud.gateway.support.NotFoundException) {
                return HttpStatus.SERVICE_UNAVAILABLE;
            } else if (cause instanceof java.util.concurrent.TimeoutException ||
                    cause.getClass().getName().contains("TimeoutException")) {
                return HttpStatus.GATEWAY_TIMEOUT;
            }
            if (cause == cause.getCause()) {
                break;
            }
            cause = cause.getCause();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
