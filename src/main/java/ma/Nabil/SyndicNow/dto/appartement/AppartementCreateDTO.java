package ma.Nabil.SyndicNow.dto.appartement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppartementCreateDTO {
    private String name;
    private String address;
    private Integer numberOfRooms;
    private Double price;
}
