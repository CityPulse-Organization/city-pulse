package city.pulse.mobile.common.exception;

import city.pulse.common.exception.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BffFeignErrorDecoder implements ErrorDecoder {
    private final ErrorDecoder defaultDecoder = new Default();
    private final ObjectMapper mapper;

    @Override
    public Exception decode(String methodKey, Response response) {
        var status = response.status();

        if (status >= 400 && status < 500) {
            try (var bodyIs = response.body().asInputStream()) {
                var errorResponse = mapper.readValue(bodyIs, ErrorResponse.class);
                return new DownstreamBusinessException(status, errorResponse);
            } catch (Exception e) {
                log.warn("Failed to parse 4xx error response from downstream", e);
            }
        }

        return defaultDecoder.decode(methodKey, response);
    }
}
