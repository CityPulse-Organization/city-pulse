package city.pulse.post.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record NearbyRequest(
        @NotNull
        @Max(90)
        @Min(-90)
        Double lat,

        @NotNull
        @Max(180)
        @Min(-180)
        Double lon,

        @NotNull
        @Positive
        @Max(50000)
        Double radius
) {}
