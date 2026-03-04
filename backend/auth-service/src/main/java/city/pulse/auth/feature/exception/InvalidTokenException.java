package city.pulse.auth.feature.exception;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException() {
        super("Invalid refresh token");
    }
}
