package city.pulse.post.dto;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PostFilterRequest(
        String caption,
        UUID authorId,

        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        OffsetDateTime createdAfter
) {}
