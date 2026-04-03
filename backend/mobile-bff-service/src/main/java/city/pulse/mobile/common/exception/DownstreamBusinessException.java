package city.pulse.mobile.common.exception;

import city.pulse.common.exception.ErrorResponse;
import lombok.Getter;

@Getter
public class DownstreamBusinessException extends RuntimeException {
    private final int status;
    private final ErrorResponse errorResponse;

    public DownstreamBusinessException(int status, ErrorResponse errorResponse) {
        super(errorResponse.message());
        this.status = status;
        this.errorResponse = errorResponse;
    }
}
