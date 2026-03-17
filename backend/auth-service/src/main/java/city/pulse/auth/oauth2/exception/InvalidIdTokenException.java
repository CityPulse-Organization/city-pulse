package city.pulse.auth.oauth2.exception;

public class InvalidIdTokenException extends RuntimeException {
    public InvalidIdTokenException(String message) {
        super(message);
    }
}
