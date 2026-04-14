package city.pulse.mobile.feed.dto.common;

import java.util.List;

public record RestPage<T>(
        List<T> content,
        PageMetadata page
) {
    public record PageMetadata(
            int size,
            int number,
            long totalElements,
            int totalPages
    ) {}
}
