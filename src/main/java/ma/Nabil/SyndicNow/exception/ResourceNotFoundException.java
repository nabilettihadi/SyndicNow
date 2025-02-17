package ma.Nabil.SyndicNow.exception;

public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s not found with id: %d", resource, id), "RESOURCE_NOT_FOUND");
    }
}
