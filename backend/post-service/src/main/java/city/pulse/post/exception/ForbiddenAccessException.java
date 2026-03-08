package city.pulse.post.exception;

public class ForbiddenAccessException extends RuntimeException {
    public ForbiddenAccessException() {
        super("User does not have permissions to perform this operation");
    }
}
